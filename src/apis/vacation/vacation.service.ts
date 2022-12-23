import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../companies/entities/company.entity';
import { Member } from '../members/entities/member.entity';
import { VacationCategory } from '../vacationCategory/entities/vacationCategory.entity';

import { Vacation } from './entities/vacation.entity';

@Injectable()
export class VacationService {
  constructor(
    @InjectRepository(Vacation)
    private readonly vacationRepository: Repository<Vacation>,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    @InjectRepository(VacationCategory)
    private readonly vacationCategoryRepository: Repository<VacationCategory>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async findAll({ companyId }) {
    await this.companyRepository.findOne({
      where: { id: companyId },
    });
    return this.vacationRepository.find({
      relations: ['member', 'company', 'vacationCategory'],
    });
  }

  async findOne({ vacationId }) {
    return this.vacationRepository.findOne({
      where: { id: vacationId },
      relations: ['member', 'company', 'vacationCategory'],
    });
  }

  async findVacationWithDate({ vacationStart, vacationEnd }) {
    return await this.vacationRepository
      .createQueryBuilder('vacation')
      .leftJoinAndSelect('vacation.member', 'member')
      .leftJoinAndSelect('vacation.company', 'company')
      .leftJoinAndSelect('vacation.vacationCategory', 'vacationCategory')
      .where('vacation.createdAt BETWEEN :vacationStart AND :vacationEnd', {
        vacationStart,
        vacationEnd,
      })
      .orderBy('vacation.vacationStart', 'DESC')
      .getMany();
    //   //받아온 start 와 end의 날짜 안에있는 값들을 찾는다.
    //   const result = [];
    //   const answer = [];
    //   const curDate = new Date(vacationStart);
    //   while (curDate <= new Date(vacationEnd)) {
    //     result.push(curDate.toISOString().split('T')[0]);
    //     curDate.setDate(curDate.getDate() + 1);
    //   }
    //   for (let i = 0; i < result.length; i++) {
    //     const period = new Date(result[i]);
    //     answer.push(period);
    //   }
    //   // DB안에있는 start와 end를 찾는다.
    //   const WithDate = await this.vacationRepository.find({
    //     where: { vacationStart: vacationStart },
    //   });
    //   console.log(vacationStart, '========', vacationEnd);
    //   console.log(answer);
    //   console.log(WithDate);
    //   // DB안에있는 start 와 end가  answer 있다면 반환
    //   if (answer.includes(WithDate)) {
    //     return await this.findAll();
    //   }
  }

  async findVacationWithDelete() {
    return await this.vacationRepository.find({
      relations: ['member'],
      withDeleted: true,
    });
  }

  async create({ createVacationInput }) {
    // 1. 직원 조회하기
    const member = await this.memberRepository.findOne({
      where: { id: createVacationInput.memberId },
      relations: ['company'],
    });
    if (!member) {
      throw new UnprocessableEntityException('해당 직원을 찾을 수 없습니다.');
    }

    // 1. 휴가 생성 시 category를 조회
    const category = await this.vacationCategoryRepository.findOne({
      where: { id: createVacationInput.vacationCategoryId },
    });
    // 2. 휴가 생성할 경우 멤버의 잔여휴가를 차감 한다.
    const result = createVacationInput.vacations.map(async (date: Date) => {
      member.leave -= category.deductionDays;
      const vacation = this.vacationRepository.create({
        vacationEndDate: date,
        vacationStartDate: date,
        description: createVacationInput.description,
        member: member,
        company: member.company,
        vacationCategory: category,
      });

      return await this.vacationRepository.save(vacation);
    });

    await this.memberRepository.save(member);

    return result;
  }

  async update({ vacationId, updateVacationInput }) {
    const member = await this.memberRepository.findOne({
      where: { id: updateVacationInput.memberId },
      relations: ['company'],
    });

    const leave = await this.vacationRepository.findOne({
      where: { id: vacationId },
      relations: ['member', 'company', 'vacationCategory'],
    });

    const category = await this.vacationCategoryRepository.findOne({
      where: { id: updateVacationInput.vacationCategoryId },
    });

    const isExist = await this.vacationRepository
      .createQueryBuilder('vacation')
      .leftJoinAndSelect('vacation.member', 'member')
      .leftJoinAndSelect('vacation.company', 'company')
      .leftJoinAndSelect('vacation.vacationCategory', 'vacationCategory')
      .where('vacation.vacationStartDate <= :date1', {
        date1: updateVacationInput.vacationStartDate,
      })
      .andWhere('vacation.vacationEndDate >= :date2', {
        date2: updateVacationInput.vacationStartDate,
      })
      .andWhere('member.id = :memberId', { memberId: member.id })
      .getOne();

    if (isExist) {
      throw new UnprocessableEntityException(
        '설정하신 날짜는 이미 기간 내에 포함되어 있습니다.',
      );
    }

    // console.log(double);
    if (
      Number(leave.vacationCategory.deductionDays) !== category.deductionDays
    ) {
      member.leave +=
        Number(leave.vacationCategory.deductionDays) - category.deductionDays;
    }
    const result = await this.vacationRepository.save({
      ...leave,
      description: updateVacationInput.description,
      vacationStartDate: updateVacationInput.vacationStartDate,
      vacationEndDate: updateVacationInput.vacationEndDate,
      vacationCategory: category,
    });

    await this.memberRepository.save({
      ...member,
    });
    console.log(result);
    return result;
  }
  async softdelete({ vacationId }) {
    const result = await this.vacationRepository.softDelete({
      id: vacationId,
    });
    return result.affected ? true : false;
  }

  async delete({ vacationId }) {
    const result = await this.vacationRepository.delete({
      id: vacationId,
    });
    return result.affected ? true : false;
  }
}
