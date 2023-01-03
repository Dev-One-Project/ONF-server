import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GlobalConfigService } from './globalConfig.service';
import { GlobalConfig } from './entities/globalConfig.entity';
import { CreateGlobalConfigInput } from './dto/createGlobalConfig.input';
import { UpdateGlobalConfigInput } from './dto/updateGlobalConfig.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { IContext } from 'src/common/types/context';

@Resolver()
export class GlobalConfigResolver {
  constructor(private readonly globalConfigService: GlobalConfigService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => GlobalConfig)
  async fetchGlobalConfig(@Context() context: IContext) {
    return await this.globalConfigService.fetch({
      companyId: context.req.user.company,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => GlobalConfig)
  async createGlobalConfig(
    @Args('createGlobalConfigInput', { nullable: true })
    createGlobalConfigInput: CreateGlobalConfigInput,
    @Context() context: IContext,
  ) {
    return await this.globalConfigService.create({
      createGlobalConfigInput,
      companyId: context.req.user.company,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => GlobalConfig)
  async updateGlobalConfig(
    @Args('updateGlobalConfigInput')
    updateGlobalConfigInput: UpdateGlobalConfigInput,
    @Context() context: IContext,
  ) {
    return await this.globalConfigService.update({
      updateGlobalConfigInput,
      companyId: context.req.user.company,
    });
  }
}
