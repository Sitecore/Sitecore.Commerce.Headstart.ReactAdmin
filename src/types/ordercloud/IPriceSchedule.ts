import {PriceSchedule, ProductAssignment} from "ordercloud-javascript-sdk"

export type IPriceSchedule = PriceSchedule<IPriceScheduleXp> & {
  // set only when retrieving product on product detail
  // for setting override price schedules, ordercloud will ignore
  ProductAssignments?: ProductAssignment[]
}

export interface IPriceScheduleXp {
  // add custom xp properties required for this project here
}
