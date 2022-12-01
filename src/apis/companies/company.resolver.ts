import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CompanyService } from './company.service';
import { CreateCompanyInput } from './dto/createCompany.input';
import { Company } from './entities/company.entity';

@Resolver()
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  //TODO: 로그인 구현 이후 로그인된 정보로 조회 하도록 수정 해야함
  @Query(() => Company, {
    description: '회사 정보 조회',
    deprecationReason: 'Initializing Status / Need Update',
  })
  async fetchCompanyDetail(@Args('companyId') companyId: string) {
    return await this.companyService.getCompanyDetail({ companyId });
  }

  @Mutation(() => Company, { description: '회사 신규 가입' })
  async createCompany(
    @Args('createCompanyInput') createCompanyInput: CreateCompanyInput,
  ) {
    return await this.companyService.createCompany({ createCompanyInput });
  }

  @Mutation(() => Company, { description: '회사 정보 수정' })
  async updateCompany(
    @Args('companyId') companyId: string,
    @Args('updateCompanyInput') updateCompanyInput: CreateCompanyInput,
  ) {
    return await this.companyService.updateCompanyDetail({
      companyId,
      updateCompanyInput,
    });
  }

  @Mutation(() => Boolean, {
    description: '회사 정보 영구 삭제 / 복구 불가능하므로 사용 주의',
  })
  async deleteCompany(@Args('companyId') companyId: string) {
    return await this.companyService.deleteCompany({ companyId });
  }
}
