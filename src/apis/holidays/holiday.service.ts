import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';
import { CompanyService } from '../companies/company.service';
import { Holiday } from './enties/holiday.entity';

@Injectable()
export class HolidayService {
  constructor(
    @InjectRepository(Holiday)
    private readonly holidayRepository: Repository<Holiday>,

    private readonly companyService: CompanyService,
  ) {}

  async create({ createHolidayInput }) {
    const { companyId, ...holiday } = createHolidayInput;

    const company = await this.companyService.findOne({
      companyId,
    });

    return await this.holidayRepository.save({
      ...holiday,
      company,
    });
  }

  async holiday(): Promise<void> {
    const date = new Date();
    const currentYear = `${date.getFullYear()}`;

    const holiday = await axios({
      url: `${process.env.HOLIDAY_API_URL}solYear=${currentYear}&numOfRows=1000&ServiceKey=${process.env.HOLIDAY_SERVICE_KEY}`,
      method: 'GET',
      data: {
        JSON: {},
      },
    }).then(function (res) {
      return res;
    });

    const result = holiday.data.response.body.items.item;

    for (let i = 0; i < result.length; i++) {
      await this.holidayRepository.save({
        ...holiday.data.response.body.items.item[i],
        year: currentYear,
      });
    }
  }

  async findAll(): Promise<Holiday[]> {
    return this.holidayRepository.find({
      order: {
        locdate: 'ASC',
      },
    });
  }

  async findCompnayHoliday({ companyId }) {
    return await this.holidayRepository.find({
      where: {
        company: {
          id: companyId,
        },
      },
    });
  }

  async updateCompnayHoliday({ holidayId, updateHolidayInput }) {
    const myCompany = await this.holidayRepository.findOne({
      where: {
        id: holidayId,
      },
    });
    const newCompnayHoliday = {
      ...myCompany,
      id: holidayId,
      ...updateHolidayInput,
    };
    return await this.holidayRepository.save(newCompnayHoliday);
  }
}
