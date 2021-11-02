module.exports = (

	process,

	rest = '--',

	serialize = ( script, executer ) => {

		script.replace(

			new RegExp( rest + '(\\w+(\\=\\w+)?)', 'gi' ),

			( word, $1 ) => {

				Object.assign( argv, executer( $1 ) );

				return word;

			}

		);

		return argv;

	},

	dismiss = ( context, item = {} ) => {

		context.replace(

			/^(\w+)\=?(.*)/g,

			( word, $1, $2 ) => {

				item[ $1 ] = $2 || true;

				return word;

			}

		);

		return item;

	},

	argv = {}

) => {

	return serialize(

		process.env.npm_lifecycle_script,

		( word ) => {

			return dismiss( word );

		}

	);

}
