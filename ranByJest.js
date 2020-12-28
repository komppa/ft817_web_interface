exports.ranByJest = () => {
    return process.env.JEST_WORKER_ID !== undefined ? true : false
}