
import {  Model, Types } from "mongoose";

export interface Borrow{
  book:Types.ObjectId;
  quantity:number;
  dueDate:Date;
} 

export interface borrowStaticMethod extends Model<Borrow> {
Borrow(bookId:string,quantity:number,dueDate:Date):Promise<Borrow>
}
