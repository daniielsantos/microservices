import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Order } from './order.entity'

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    quantity: string

    productId: number

    @ManyToOne(() => Order, order => order.items, { nullable: true })
    @JoinColumn({name: 'order_id'})
    order: Order

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    created_at: string
}

