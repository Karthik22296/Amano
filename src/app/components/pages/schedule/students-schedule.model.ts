import { formatDate } from '@angular/common';
export class Calendar {
    id: number;
    lead_time: string;
    schedule_name: string;
    schedule_owner:string;
    schedule_view:string;
    schedule_view_assignment:string;
    startDate: string;
    endDate: string;

    constructor(calendar) {
        {
            this.id = calendar.id || this.getRandomID();
            this.lead_time = calendar.lead_time || '';
            this.schedule_name = calendar.schedule_name || '';
            this.schedule_owner = calendar.schedule_owner || '';
            this.schedule_view = calendar.schedule_view || '';
            this.schedule_view_assignment = calendar.schedule_view_assignment || '';
            this.startDate = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';
            this.endDate = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';
        }
    }
    public getRandomID(): string {
        const S4 = () => {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return S4() + S4();
    }
}
