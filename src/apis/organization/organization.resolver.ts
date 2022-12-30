import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateOrganizationInput } from './dto/createOrganization.input';
import { UpdateOrganizationInput } from './dto/updateOrganization.input';
import { Organization } from './entities/organization.entity';
import { OrganizationService } from './organization.service';
import { IContext } from 'src/common/types/context';
import { Roles } from 'src/common/auth/roles.decorator';
import { Role } from 'src/common/types/enum.role';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { RolesGuard } from 'src/common/auth/roles.guard';

@Resolver()
export class OrganizationResolver {
  constructor(private readonly organizationService: OrganizationService) {}

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => [Organization], { description: '조직 리스트 조회' })
  async fetchOrganizations(@Context() context: IContext) {
    return await this.organizationService.findAll({
      companyId: context.req.user.company,
    });
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => Organization, { description: '조직 상세 조회' })
  async fetchOrganizationDetail(
    @Args('organizationId') organizationId: string,
  ) {
    return await this.organizationService.getOrganizationDetail({
      organizationId,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Organization, { description: '조직 신규 생성' })
  async createOrganization(
    @Args('createOrganizationInput')
    createOrganizationInput: CreateOrganizationInput,
    @Context() context: IContext,
  ) {
    return await this.organizationService.create({
      createOrganizationInput,
      companyId: context.req.user.company,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Organization, { description: '조직 정보 수정' })
  async updateOrganization(
    @Args('organizationId') organizationId: string,
    @Args('updateOrganizationInput')
    updateOrganizationInput: UpdateOrganizationInput,
    @Context() context: IContext,
  ) {
    return await this.organizationService.update({
      organizationId,
      companyId: context.req.user.company,
      updateOrganizationInput,
    });
  }

  @Mutation(() => Boolean, { description: '조직 정보 삭제' })
  async deleteOrganization(@Args('organizationid') organizationId: string) {
    return await this.organizationService.delete({ organizationId });
  }
}
