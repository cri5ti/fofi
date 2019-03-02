import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {

        params: {
        },

        feats: [
            {
                id: 'inc1',
                name: 'Income',
                type: 'income.monthly',
                enabled: true,
                setup: {
                    type: '',
                    date: 6,
                    amt_monthly: 3500
                }
            },
            {
                id: 'exp1',
                name: 'Expense',
                type: 'expense.weekly',
                enabled: true,
                setup: {
                    type: '',
                    day: 4,
                    amt: 500
                }
            },
            {
                id: 'mtg1',
                name: 'Mortgage',
                type: 'loan.mortgage',
                enabled: true,
                setup: {
                    date: 25,
                    loan_value: 250000,
                    rate: 1.5,
                    years: 25
                }
            },
        ],

        setup: {
            start: new Date(2019,2,1),
            end: new Date(2029,5,1)
        }
    },

    getters: {
        series: (s) => {

            console.time('series');

            const data = [];
            const {feats, setup} = s;

            // const feats = s.feats.list.map(i => i.id);
            const calcs = feats.map(i => {
                if (i.enabled === false) return null;
                const s = i.setup;
                const factory = types[i.type];
                if (!factory) {
                    console.warn(`Unknown calculator ${s.type}`);
                    return null;
                }
                const c = new factory(s);
                c.serie = { name: i.name || i.type, data: [] };
                c.cv = 0;
                return c;
            }).filter(i => !!i);

            console.log(calcs);

            const {start, end} = setup;

            let d = new Date(start);
            let v = 5000;

            // let next = (d:Date) => d.getDate() == 1;
            let next = (d:Date) => d.getDay() == 1;

            while (d < end) {
                const ts = d.getTime();

                for(let c of calcs) {
                    let cv = c.get(d);
                    // c.serie.data.push([ts, cv]);

                    if (cv.v)
                        c.cv = cv.v;
                    else
                        c.cv += cv;

                    v += cv;
                }

                d.setUTCDate(d.getUTCDate()+1);
                // data.push([ts, v]);

                if (next(d)) {
                    data.push([ts, v]);

                    for(let c of calcs) {
                        c.serie.data.push([ts, c.cv]);
                        c.cv = 0;
                    }
                }
            }

            console.timeEnd('series');

            return [
                {
                    name: 'Balance',
                    data
                },
                ...calcs.map(i => i.serie),
            ];
        }
    },

    mutations: {

    },

    actions: {
        toggleFeature({state}, { id, enabled }) {
            state.feats.find(i => i.id == id)!.enabled = enabled;
            console.log(state.feats);
        }
    },
});



// type



interface Calculator<S = any> {
    setup: S;
    get(d: Date): number;
    serie?: any;
}


type SetupOf<T> = T extends Calculator<infer P> ? P : never;

type IncomeMonthlySetup = {
    date: 5,
    amt_monthly: 3500
};
class IncomeMonthly implements Calculator<IncomeMonthlySetup> {
    constructor(public setup: IncomeMonthlySetup) {}

    get(d:Date): number {
        if (d.getUTCDate() == this.setup.date)
            return this.setup.amt_monthly;
        return 0;
    }
}

type ExpenseWeeklySetup = {
    day: 5,
    amt: 400
};
class ExpenseWeekly implements Calculator<ExpenseWeeklySetup> {
    constructor(public setup:ExpenseWeeklySetup) {}

    get(d:Date): number {
        if (d.getUTCDay() == this.setup.day)
            return -this.setup.amt;
        return 0;
    }
}




type LoanMortgageSetup = {
    date: number,
    loan_value: number,
    rate: number,
    years: number
};
class LoanMortgage implements Calculator<LoanMortgageSetup> {
    constructor(public setup:LoanMortgageSetup) {
        this.pmt = PMT(setup.rate/12/100, setup.years*12, -setup.loan_value);
        this.pv = -setup.loan_value;
    }

    private readonly pmt: number;
    private pv: number;

    get(d:Date): number {
        if (d.getUTCDate() == this.setup.date) {
            const int = this.pv * (this.setup.rate/12/100);
            const princ = this.pmt - int;
            this.pv += princ;
        }
        return { v: this.pv };
    }
}



const types: { [key: string]: { new(state:any): Calculator } } = {
    'income.monthly': IncomeMonthly,
    'expense.weekly': ExpenseWeekly,
    'loan.mortgage': LoanMortgage,
};


/**
 * @param ir   - interest rate per month
 * @param np   - number of periods (months)
 * @param pv   - present value
 * @param fv   - future value
 * @param type - when the payments are due:
 *        0: end of the period, e.g. end of month (default)
 *        1: beginning of period
 */
function PMT(ir: number, np: number, pv: number, fv: number = 0, type: number = 0): number {
    let pmt, pvif;
    if (ir === 0)
        return -(pv + fv)/np;

    pvif = Math.pow(1 + ir, np);
    pmt = - ir * pv * (pvif + fv) / (pvif - 1);

    if (type === 1)
        pmt /= (1 + ir);

    return pmt;
}

