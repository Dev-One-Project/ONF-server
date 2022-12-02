import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateWorkCheckInput } from './dto/createWorkCheck.input';
import { UpdateWorkCheckInput } from './dto/updateWorkCheck.input';
import { WorkCheck } from './entities/workCheck.entity';
import { WorkCheckService } from './workCheck.service';

@Resolver()
export class WorkCheckResolver {
  constructor(
    private readonly workCheckService: WorkCheckService, //
  ) {}

  @Query(() => [WorkCheck])
  async fetchWorkChecks() {
    return await this.workCheckService.findAll();
  }

  @Query(() => WorkCheck)
  async fetchWorkCheck(
    @Args('memberId') memberId: string, //
  ) {
    return await this.workCheckService.findOne({ memberId });
  }

  @Mutation(() => WorkCheck)
  async createWorkCheck(
    @Args('createWorkCheckInput') createWorkCheckInput: CreateWorkCheckInput,
  ) {
    return await this.workCheckService.create({ createWorkCheckInput });
  }

  @Mutation(() => WorkCheck)
  async updateWorkCheck(
    @Args('workCheckId') workCheckId: string, //
    @Args('updateWorkCheckInput') updateWorkCheckInput: UpdateWorkCheckInput,
  ) {
    return await this.workCheckService.update({
      workCheckId,
      updateWorkCheckInput,
    });
  }

  @Mutation(() => Boolean)
  async deleteWorkCheck(
    @Args('workCheckId') workCheckId: string, //
  ) {
    return await this.workCheckService.delete({ workCheckId });
  }
}
