import Vue from 'vue';
import Vuex from 'vuex';
import set = Reflect.set;

Vue.use(Vuex);

export default new Vuex.Store({
    state: {

        params: {
        },

        feats: {
            list: [
                {id: 'inc1', name: 'Income', type: 'income'},
                {id: 'exp1', name: 'Expense', type: 'expense'},
            ],

            byId: {
                'inc1': {
                    type: 'income.monthly',
                    date: 6,
                    amt_monthly: 3500
                },
                'exp1': {
                    type: 'expense.weekly',
                    day: 4,
                    amt: 400
                },
                'mtg1': {
                    type: 'mortgage.1',
                    rate: 1.5,
                    years: 25
                }
            }
        },

        setup: {
            start: new Date(2019,2,1),
            end: new Date(2019,5,1)
        }
    },

    getters: {
        series: (s) => {

            const data = [];
            const {feats, setup} = s;

            // const feats = s.feats.list.map(i => i.id);
            const calcs = feats.list.map(i => {
                const s = feats.byId[i.id];
                if (!s) {
                    console.warn(`Unknown feature ${i.id}`);
                    return null;
                }
                const factory = types[s.type];
                if (!factory) {
                    console.warn(`Unknown calculator ${s.type}`);
                    return null;
                }
                const c = new factory(s);
                c.serie = { name: s.type, data: [] };
                return c;
            }).filter(i => !!i);

            console.log(calcs);

            const {start, end} = setup;

            let d = new Date(start);
            let v = 5000;

            while (d < end) {
                const ts = d.getTime();

                for(let c of calcs) {
                    let cv = c.get(d);
                    c.serie.data.push([ts, cv]);
                    v += cv;
                }

                d.setUTCDate(d.getUTCDate()+1);
                data.push([ts, v]);
            }

            return [
                ...calcs.map(i => i.serie),
                {
                    name: 'Balance',
                    data
                }
            ];
        }
    },

    mutations: {

    },

    actions: {

    },
});



// type



interface Calculator<S = any> {
    setup: S;
    get(d: Date): number;
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

const types: { [key: string]: { new(): Calculator } } = {
    'income.monthly': IncomeMonthly,
    'expense.weekly': ExpenseWeekly
};
