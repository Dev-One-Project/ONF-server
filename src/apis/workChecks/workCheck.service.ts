import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../members/entities/member.entity';
import { WorkCheck } from './entities/workCheck.entity';

@Injectable()
export class WorkCheckService {
  constructor(
    @InjectRepository(WorkCheck)
    private readonly workCheckRepository: Repository<WorkCheck>, //

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async findAll() {
    return await this.workCheckRepository
      .createQueryBuilder('WorkCheck')
      .getMany();
  }

  async findOne({ memberId }) {
    return await this.workCheckRepository
      .createQueryBuilder('WorkCheck')
      .leftJoinAndSelect('WorkCheck.member', 'member')
      .where('WorkCheck.member = :id', { id: memberId })
      .getOne();
  }

  async create({ createWorkCheckInput }) {
    const offset = 1000 * 60 * 60 * 9;
    const koreaTime = new Date(new Date().getTime() + offset);

    return await this.workCheckRepository.save({
      ...createWorkCheckInput,
      workingTime: koreaTime
        .toISOString()
        .replace('T', ' ')
        .split(' ')[1]
        .slice(0, 5),
    });
  }

  async update({ workCheckId, updateWorkCheckInput }) {
    const findWorkCheck = await this.workCheckRepository.findOne({
      where: { id: workCheckId },
    });

    return await this.workCheckRepository.save({
      ...findWorkCheck,
      id: findWorkCheck.id,
      ...updateWorkCheckInput,
    });
  }

  async delete({ workCheckId }) {
    const result = await this.workCheckRepository.delete({
      id: workCheckId,
    });

    return result.affected ? true : false;
  }
}
