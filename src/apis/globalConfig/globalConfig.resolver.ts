import { Resolver } from '@nestjs/graphql';
import { GlobalConfigService } from './globalConfig.service';

@Resolver()
export class GlobalConfigResolver {
  constructor(private readonly globalConfigService: GlobalConfigService) {}
}
