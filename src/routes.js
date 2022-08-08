export default {
	childRoutes: [
		{
			path: '404',
			getComponent(nextState, cb) {
				require.ensure([], (require) => {
					cb(null, require('./common/notFound'));
				})
			}
		},
		{
			path: '/',
			getComponent(nextState, cb) {
				require.ensure([], (require) => {
					cb(null, require('./hello'))
				})
			}
		}
	]
}