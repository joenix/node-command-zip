module.exports = (

	process,

	group = process.argv.slice(2),

	dismiss = ( context, item = {} ) => {

		context.replace(

			/^\-{2}?([\w\.\-\:\/]+)\=?(.*)/g,

			( $0, $1, $2 ) => {

				item[ $1 ] = $2 || true;

				return $0;

			}

		);

		return item;

	},

	argv = {}

) => {

	group.map(

		( context ) => {

			Object.assign( argv, dismiss( context ) );

		}

	);

	return argv;

}
