import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GlobalConfigService } from './globalConfig.service';
import { GlobalConfig } from './entities/globalConfig.entity';
import { CreateGlobalConfigInput } from './dto/createGlobalConfig.input';
import { UpdateGlobalConfigInput } from './dto/updateGlobalConfig.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';

@Resolver()
export class GlobalConfigResolver {
  constructor(private readonly globalConfigService: GlobalConfigService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => GlobalConfig)
  async fetchGlobalConfig(@Args('companyId') companyId: string) {
    return await this.globalConfigService.fetch({ companyId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => GlobalConfig)
  async createGlobalConfig(
    @Args('createGlobalConfigInput')
    createGlobalConfigInput: CreateGlobalConfigInput,
  ) {
    return await this.globalConfigService.create({ createGlobalConfigInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => GlobalConfig)
  async updateGlobalConfig(
    @Args('updateGlobalConfigInput')
    updateGlobalConfigInput: UpdateGlobalConfigInput,
  ) {
    return await this.globalConfigService.update({ updateGlobalConfigInput });
  }
}
