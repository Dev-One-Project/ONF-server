import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../organization/entities/organization.entity';
import { RoleCategory } from '../roleCategory/entities/roleCategory.entity';
import { ScheduleTemplate } from './entities/scheduleTemplate.entity';

@Injectable()
export class ScheduleTemplateService {
  constructor(
    @InjectRepository(ScheduleTemplate)
    private readonly scheduleTemplateRepository: Repository<ScheduleTemplate>, //

    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,

    @InjectRepository(RoleCategory)
    private readonly roleCategoryRepository: Repository<RoleCategory>,
  ) {}

  async findAll({ companyId }) {
    return await this.scheduleTemplateRepository.find({
      where: { company: { id: companyId } },
      relations: [
        'organization',
        'roleCategory',
        'scheduleCategory',
        'company',
      ],
    });
  }

  async create({ companyId, createScheduleTemplateInput }) {
    const {
      scheduleCategoryId,
      organizationId,
      roleCategoryId,
      ...scheduleTemplate
    } = createScheduleTemplateInput;

    // let manyOrganization: string | string[];

    // if (organizationId) {
    //   manyOrganization = await Promise.all(
    //     organizationId.map(
    //       async (organization: string) =>
    //         new Promise(async (res, rej) => {
    //           try {
    //             const prev = await this.organizationRepository.findOne({
    //               where: { id: organization },
    //             });
    //             if (prev) {
    //               res(prev);
    //             } else {
    //               throw new UnprocessableEntityException(
    //                 '존재하지 않는 지점을 넣으셨습니다.',
    //               );
    //             }
    //           } catch (err) {
    //             console.log(err.message);
    //             rej(err.message);
    //           }
    //         }),
    //     ),
    //   );
    // }

    // let manyRoleCategory: string | string[];

    // if (roleCategoryId) {
    //   manyRoleCategory = await Promise.all(
    //     roleCategoryId.map(
    //       async (roleCategoy: string) =>
    //         new Promise(async (res, rej) => {
    //           try {
    //             const prev = await this.roleCategoryRepository.findOne({
    //               where: { id: roleCategoy },
    //             });

    //             if (prev) {
    //               res(prev);
    //             } else {
    //               throw new UnprocessableEntityException(
    //                 '존재하지않는 직무를 넣었습니다.',
    //               );
    //             }
    //           } catch (err) {
    //             console.log(err.message);
    //             rej(err.message);
    //           }
    //         }),
    //     ),
    //   );
    // }

    const manyOrganization = await Promise.all(
      organizationId.map(async (organizationId) => {
        return await this.organizationRepository.findOne({
          where: { id: organizationId },
        });
      }),
    );

    const manyRoleCategory = await Promise.all(
      roleCategoryId.map(async (roleCategoryId) => {
        return await this.roleCategoryRepository.findOne({
          where: { id: roleCategoryId },
        });
      }),
    );

    return await this.scheduleTemplateRepository.save({
      ...scheduleTemplate,
      scheduleCategory: scheduleCategoryId,
      organization: manyOrganization,
      roleCategory: manyRoleCategory,
      company: companyId,
    });
  }

  async update({ scheduleTemplateId, updateScheduleTemplateInput }) {
    const origin = await this.scheduleTemplateRepository.findOne({
      where: { id: scheduleTemplateId },
    });

    const { scheduleCategoryId, organizationId, roleCategoryId, ...rest } =
      updateScheduleTemplateInput;

    let manyOrganization: string[];

    if (organizationId) {
      manyOrganization = await Promise.all(
        organizationId.map(async (organizationId) => {
          return await this.organizationRepository.findOne({
            where: { id: organizationId },
          });
        }),
      );
    }

    let manyRoleCategory: string[];
    if (roleCategoryId) {
      manyRoleCategory = await Promise.all(
        roleCategoryId.map(async (roleCategoryId) => {
          return await this.roleCategoryRepository.findOne({
            where: { id: roleCategoryId },
          });
        }),
      );
    }

    return await this.scheduleTemplateRepository.save({
      ...origin,
      id: scheduleTemplateId,
      ...rest,
      scheduleCategory: scheduleCategoryId,
      organization: manyOrganization,
      roleCategory: manyRoleCategory,
    });
  }

  async deleteOne({ scheduleTemplateId }) {
    const result = await this.scheduleTemplateRepository.delete({
      id: scheduleTemplateId,
    });

    return result.affected ? true : false;
  }

  async deleteMany({ scheduleTemplateId }) {
    let result = true;
    for await (const id of scheduleTemplateId) {
      const deletes = await this.scheduleTemplateRepository.delete({ id });

      if (!deletes.affected) result = false;
    }
    return result;
  }
}
