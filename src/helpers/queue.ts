import pify from 'pify'
interface RequestQueue {
    maxLimit: number
    retry: number
    requestApi: AsyncGeneratorFunction
    requestQueue: CallableFunction[]
    currentConcurrent: number
}

class RequestQueue {
    constructor({
        requestApi,
        maxLimit = 5,
        retry = 1,
        needChange2Promise = false
    }) {
        // 最大并发量
        this.maxLimit = maxLimit;
        // 请求队列,若当前请求并发量已经超过maxLimit,则将该请求加入到请求队列中
        this.requestQueue = [];
        // 当前并发量数目
        this.currentConcurrent = 0;
        this.retry = retry
        // 使用者定义的请求api，若用户传入needChange2Promise为true,则将用户的callback请求api使用pify这个库将其转化为promise的
        this.requestApi = needChange2Promise ? pify(requestApi) : requestApi;
    }
    // 发起请求api
    async request(...args: any[]) {
        if (this.currentConcurrent >= this.maxLimit) {
            await this.startBlocking();
        }
        console.log('processing')
        try {
            this.currentConcurrent++;
            const result = await this.requestApi(...args);
            return Promise.resolve(result);
        } catch (err) {
            return Promise.reject(err);
        } finally {
            this.currentConcurrent--;
            console.log('剩余任务量', this.requestQueue.length)
            this.next();
        }
    }
    // 新建一个promise,并且将该reolsve函数放入到requestQueue队列里。
    // 当调用next函数的时候，会从队列里取出一个resolve函数并执行。
    startBlocking() {
        let _resolve = (value: unknown) => { };
        let promise2 = new Promise((resolve, reject) => _resolve = resolve);
        this.requestQueue.push(_resolve);
        return promise2;
    }
    // 从请求队列里取出队首的resolve并执行。
    next() {
        if (this.requestQueue.length <= 0) return;
        const _resolve = this.requestQueue.shift() as CallableFunction;
        _resolve();
    }
}
export default RequestQueue