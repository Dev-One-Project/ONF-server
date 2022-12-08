import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRoleCategoryInput } from './dto/createRoleCategory.input';
import { UpdateRoleCategoryInput } from './dto/updateRoleCategory.input';
import { RoleCategory } from './entities/roleCategory.entity';
import { RoleCategoryService } from './roleCategory.service';

@Resolver()
export class RoleCategoryResolver {
  constructor(
    private readonly roleCategoryService: RoleCategoryService, //
  ) {}

  @Mutation(() => RoleCategory)
  createRoleCategory(
    @Args('createRoleCategoryInput')
    createRoleCategoryInput: CreateRoleCategoryInput,
  ) {
    return this.roleCategoryService.create(createRoleCategoryInput);
  }

  @Query(() => RoleCategory, { description: 'Fetch RoleCategory' })
  fetchRoleCategory(
    @Args('roleCategoryId') roleCategoryId: string, //
  ) {
    return this.roleCategoryService.findOne({ roleCategoryId });
  }

  @Query(() => [RoleCategory], { description: 'Fetch RoleCategorys' })
  fetchRoleCategorys() {
    return this.roleCategoryService.findAll();
  }

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
