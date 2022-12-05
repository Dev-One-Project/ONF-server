import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateOrganizationInput } from './dto/createOrganization.input';
import { UpdateOrganizationInput } from './dto/updateOrganization.input';
import { Organization } from './entities/organization.entity';
import { OrganizationService } from './organization.service';

@Resolver()
export class OrganizationResolver {
  constructor(private readonly organizationService: OrganizationService) {}
  @Query(() => [Organization], { description: '조직 리스트 조회' })
  async fetchOrganizations(@Args('companyId') companyId: string) {
    return await this.organizationService.findAll({ companyId });
  }

  @Query(() => Organization, { description: '조직 상세 조회' })
  async fetchOrganizationDetail(
    @Args('organizationId') organizationId: string,
  ) {
    return await this.organizationService.getOrganizationDetail({
      organizationId,
    });
  }

  @Mutation(() => Organization, { description: '조직 신규 생성' })
  async createOrganization(
    @Args('createOrganizationInput')
    createOrganizationInput: CreateOrganizationInput,
  ) {
    return await this.organizationService.create({ createOrganizationInput });
  }

  @Mutation(() => Organization, { description: '조직 정보 수정' })
  async updateOrganization(
    @Args('organizationId') organizationId: string,
    @Args('updateOrganizationInput')
    updateOrganizationInput: UpdateOrganizationInput,
  ) {
    return await this.organizationService.update({
      organizationId,
      updateOrganizationInput,
    });
  }

  @Mutation(() => Boolean, { description: '조직 정보 삭제' })
  async deleteOrganization(@Args('organizationid') organizationId: string) {
    return await this.organizationService.delete({ organizationId });
  }
}
