import { Controller, Logger } from '@nestjs/common';
import { OrderServiceService } from './order-service.service';
import { MessagePattern } from '@nestjs/microservices';

// interface Order {
//   user:number,
//   [number],
  
// }


@Controller()
export class OrderServiceController {
  constructor(private readonly orderServiceService: OrderServiceService) {}

  @MessagePattern('test')
  getHello(): string {
    Logger.log('here maan');
    return 'hi';
  }


  @MessagePattern('create')
  async create(){
    
    
  }


}
