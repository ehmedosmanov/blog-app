import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"
import { PaginationQueryDto } from "../../common/dto/pagination-query.dto"

export class PostFilterDto extends PaginationQueryDto {
  @ApiProperty({ required: false, description: "Search title,category or content" })
  @IsString()
  @IsOptional()
  search?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  category?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  userId?: string
}
