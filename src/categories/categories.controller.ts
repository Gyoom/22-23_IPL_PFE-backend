import { Body, Controller, Get, Inject, Logger, Param, Post, Delete, Put } from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';
import { CategoriesService } from './categories.service';


@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService){}
    

    //get one event if public or invited
    @Get(':name')
    public async getOne(@Param () param){
        Logger.log("Request : /categories/" + param.name);
        return await this.categoriesService.findByName(param.name);
    }

    //get all category
    @Get('/')
    public async getAll(){
        Logger.log("Request: /categories/");
        return await this.categoriesService.findAll();
    }

    //create a category
    @Post('/createCategory')
    public async createCateogry(@Body () categoryDto: CategoryDto){
        Logger.log("Request : /categories/createCategory/" );
        return await this.categoriesService.createCategory(categoryDto);
    }

    


}


