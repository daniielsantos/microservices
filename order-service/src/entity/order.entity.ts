import {Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm'
import { OrderItem } from './order.item.entity'

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number
  
    @Column()
    clientEmail: string

    @OneToMany(() => OrderItem, orderItem => orderItem.order, { nullable: true })
    @JoinColumn({name: 'order_id'})
    items: OrderItem[]

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    created_at: string
}

