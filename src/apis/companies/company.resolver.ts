import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CompanyService } from './company.service';
import { CreateCompanyInput } from './dto/createCompany.input';
import { Company } from './entities/company.entity';
import { UpdateCompanyInput } from './dto/updateCompany.input';
import { IContext } from 'src/common/types/context';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { Roles } from 'src/common/auth/roles.decorator';
import { Role } from 'src/common/types/enum.role';
import { RolesGuard } from 'src/common/auth/roles.guard';

@Resolver()
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Company, {
    description: '회사 정보 조회',
    deprecationReason: 'Initializing Status / Need Update',
  })
  async fetchCompanyDetail(@Context() context: IContext) {
    return await this.companyService.getCompanyDetail({
      companyId: context.req.user.company,
    });
  }

  @Mutation(() => Company, {
    description: '회사 신규 가입',
    deprecationReason:
      '회원가입 시 자동으로 회사가 생성됩니다. 테스트용으로 수동생성시에만 사용하여 주세요',
  })
  async createCompany(
    @Args('createCompanyInput') createCompanyInput: CreateCompanyInput,
  ) {
    return await this.companyService.createCompany({ createCompanyInput });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Company, { description: '회사 정보 수정' })
  async updateCompany(
    @Context() context: IContext,
    @Args('updateCompanyInput') updateCompanyInput: UpdateCompanyInput,
  ) {
    return await this.companyService.updateCompanyDetail({
      companyId: context.req.user.company,
      updateCompanyInput,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Boolean, {
    description: '회사 정보 영구 삭제 / 복구 불가능하므로 사용 주의',
  })
  async deleteCompany(@Context() context: IContext) {
    return await this.companyService.deleteCompany({
      companyId: context.req.user.company,
    });
  }
}
