import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRoleCategoryInput } from './dto/createRoleCategory.input';
import { UpdateRoleCategoryInput } from './dto/updateRoleCategory.input';
import { RoleCategory } from './entities/roleCategory.entity';
import { RoleCategoryService } from './roleCategory.service';
import { IContext } from 'src/common/types/context';
import { Roles } from 'src/common/auth/roles.decorator';
import { Role } from 'src/common/types/enum.role';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { RolesGuard } from 'src/common/auth/roles.guard';

@Resolver()
export class RoleCategoryResolver {
  constructor(
    private readonly roleCategoryService: RoleCategoryService, //
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => RoleCategory, { description: 'Create RoleCategory' })
  createRoleCategory(
    @Args('createRoleCategoryInput')
    createRoleCategoryInput: CreateRoleCategoryInput,
    @Context() context: IContext,
  ) {
    return this.roleCategoryService.create({
      createRoleCategoryInput,
      companyId: context.req.user.company,
    });
  }

  @Query(() => RoleCategory, { description: 'Fetch RoleCategory' })
  fetchRoleCategory(
    @Args('roleCategoryId') roleCategoryId: string, //
  ) {
    return this.roleCategoryService.findOne({ roleCategoryId });
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => [RoleCategory], { description: 'Fetch RoleCategorys' })
  fetchRoleCategories(@Context() context: IContext) {
    return this.roleCategoryService.findAll({
      companyId: context.req.user.company,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => RoleCategory, { description: 'Update RoleCategory' })
  updateRoleCategory(
    @Args('roleCategoryId') roleCategoryId: string,
    @Args('updateRoleCategoryInput')
    updateRoleCategoryInput: UpdateRoleCategoryInput,
  ) {
    return this.roleCategoryService.update({
      roleCategoryId,
      updateRoleCategoryInput,
    });
  }

  @Mutation(() => Boolean, {
    description: 'Delte RoleCategory by useing roleCategoryId',
  })
  deleteRoleCategory(
    @Args('roleCategoryId') roleCategoryId: string, //
  ) {
    return this.roleCategoryService.remove({ roleCategoryId });
  }
}
