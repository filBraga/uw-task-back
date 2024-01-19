// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CinemaModule } from './modules/cinema/cinema.module';
import { ConfigModule } from '@nestjs/config';
import { HallModule } from './modules/hall/hall.module';
import { ReservedSeatModule } from './modules/reserved-seat/reserved-seat.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // do not use in prod
    }),
    CinemaModule,
    HallModule,
    ReservedSeatModule,
  ],
})
export class AppModule {}
