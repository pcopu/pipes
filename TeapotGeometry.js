import {
	BufferAttribute,
	BufferGeometry,
	Vector3
} from 'three';

/**
 * THREE.TeapotGeometry is a geometry for a teapot, based on the Utah Teapot
 * dataset. The geometry is constructed from Bezier patches, and is rendered
 * with a custom shader. The geometry can be rendered with or without a lid,
 * and with or without a bottom. The geometry can also be rendered with a
 * custom material.
 *
 * @class TeapotGeometry
 * @extends THREE.BufferGeometry
 * @param {number} size The size of the teapot.
 * @param {number} segments The number of segments to use for the teapot.
 * @param {boolean} bottom Whether to render the bottom of the teapot.
 * @param {boolean} lid Whether to render the lid of the teapot.
 * @param {boolean} body Whether to render the body of the teapot.
 * @param {boolean} fitLid Whether to fit the lid to the body.
 * @param {boolean} blinn Whether to use Blinn-Phong shading.
 */

const TeapotGeometry = function ( size, segments, bottom, lid, body, fitLid, blinn ) {

	BufferGeometry.call( this );

	this.type = 'TeapotGeometry';

	this.size = size || 1;
	this.segments = segments || 10;
	this.bottom = bottom !== undefined ? bottom : true;
	this.lid = lid !== undefined ? lid : true;
	this.body = body !== undefined ? body : true;
	this.fitLid = fitLid !== undefined ? fitLid : false;
	this.blinn = blinn !== undefined ? blinn : true;

	// data

	const vertices = [],
		normals = [],
		indices = [];

	// control points

	const cp = [
		[ // body
			[ 1.5, 0, 2.4, 1 ],
			[ 1.5, - 0.8, 2.4, 1 ],
			[ 0.8, - 1.5, 2.4, 1 ],
			[ 0, - 1.5, 2.4, 1 ],
			[ 1.5, 0, 1.8, 1 ],
			[ 1.5, - 0.8, 1.8, 1 ],
			[ 0.8, - 1.5, 1.8, 1 ],
			[ 0, - 1.5, 1.8, 1 ],
			[ 1.5, 0, 1.2, 1 ],
			[ 1.5, - 0.8, 1.2, 1 ],
			[ 0.8, - 1.5, 1.2, 1 ],
			[ 0, - 1.5, 1.2, 1 ],
			[ 1.5, 0, 0.6, 1 ],
			[ 1.5, - 0.8, 0.6, 1 ],
			[ 0.8, - 1.5, 0.6, 1 ],
			[ 0, - 1.5, 0.6, 1 ],
			[ 1.5, 0, 0, 1 ],
			[ 1.5, - 0.8, 0, 1 ],
			[ 0.8, - 1.5, 0, 1 ],
			[ 0, - 1.5, 0, 1 ]
		],
		[ // lid
			[ 1.5, 0, 2.4, 1 ],
			[ 1.5, - 0.8, 2.4, 1 ],
			[ 0.8, - 1.5, 2.4, 1 ],
			[ 0, - 1.5, 2.4, 1 ],
			[ 1.5, 0, 1.8, 1 ],
			[ 1.5, - 0.8, 1.8, 1 ],
			[ 0.8, - 1.5, 1.8, 1 ],
			[ 0, - 1.5, 1.8, 1 ],
			[ 1.5, 0, 1.2, 1 ],
			[ 1.5, - 0.8, 1.2, 1 ],
			[ 0.8, - 1.5, 1.2, 1 ],
			[ 0, - 1.5, 1.2, 1 ],
			[ 1.5, 0, 0.6, 1 ],
			[ 1.5, - 0.8, 0.6, 1 ],
			[ 0.8, - 1.5, 0.6, 1 ],
			[ 0, - 1.5, 0.6, 1 ],
			[ 0, 0, 0, 1 ],
			[ 0, - 0.8, 0, 1 ],
			[ 0.8, - 1.5, 0, 1 ],
			[ 0, - 1.5, 0, 1 ]
		],
		[ // handle
			[ 1.5, 0, 2.4, 1 ],
			[ 1.5, - 0.8, 2.4, 1 ],
			[ 0.8, - 1.5, 2.4, 1 ],
			[ 0, - 1.5, 2.4, 1 ],
			[ 1.5, 0, 1.8, 1 ],
			[ 1.5, - 0.8, 1.8, 1 ],
			[ 0.8, - 1.5, 1.8, 1 ],
			[ 0, - 1.5, 1.8, 1 ],
			[ 1.5, 0, 1.2, 1 ],
			[ 1.5, - 0.8, 1.2, 1 ],
			[ 0.8, - 1.5, 1.2, 1 ],
			[ 0, - 1.5, 1.2, 1 ],
			[ 1.5, 0, 0.6, 1 ],
			[ 1.5, - 0.8, 0.6, 1 ],
			[ 0.8, - 1.5, 0.6, 1 ],
			[ 0, - 1.5, 0.6, 1 ],
			[ 1.5, 0, 0, 1 ],
			[ 1.5, - 0.8, 0, 1 ],
			[ 0.8, - 1.5, 0, 1 ],
			[ 0, - 1.5, 0, 1 ]
		],
		[ // spout
			[ 1.5, 0, 2.4, 1 ],
			[ 1.5, - 0.8, 2.4, 1 ],
			[ 0.8, - 1.5, 2.4, 1 ],
			[ 0, - 1.5, 2.4, 1 ],
			[ 1.5, 0, 1.8, 1 ],
			[ 1.5, - 0.8, 1.8, 1 ],
			[ 0.8, - 1.5, 1.8, 1 ],
			[ 0, - 1.5, 1.8, 1 ],
			[ 1.5, 0, 1.2, 1 ],
			[ 1.5, - 0.8, 1.2, 1 ],
			[ 0.8, - 1.5, 1.2, 1 ],
			[ 0, - 1.5, 1.2, 1 ],
			[ 1.5, 0, 0.6, 1 ],
			[ 1.5, - 0.8, 0.6, 1 ],
			[ 0.8, - 1.5, 0.6, 1 ],
			[ 0, - 1.5, 0.6, 1 ],
			[ 1.5, 0, 0, 1 ],
			[ 1.5, - 0.8, 0, 1 ],
			[ 0.8, - 1.5, 0, 1 ],
			[ 0, - 1.5, 0, 1 ]
		]
	];

	const patch = [
		[ // body
			[ 102, 103, 104, 105, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ],
			[ 3, 2, 1, 0, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27 ],
			[ 110, 111, 112, 113, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39 ],
			[ 109, 108, 107, 106, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51 ],
			[ 1, 2, 3, 4, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63 ],
			[ 114, 115, 116, 117, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75 ],
			[ 118, 119, 120, 121, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87 ],
			[ 122, 123, 124, 125, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99 ],
			[ 126, 127, 128, 129, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111 ]
		],
		[ // lid
			[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ],
			[ 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31 ],
			[ 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47 ],
			[ 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63 ]
		],
		[ // handle
			[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ],
			[ 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31 ]
		],
		[ // spout
			[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ],
			[ 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31 ]
		]
	];

	const v = new Vector3();

	function getU( t, p ) {

		return ( t * t * t * p[ 0 ] + 3 * t * t * ( 1 - t ) * p[ 1 ] + 3 * t * ( 1 - t ) * ( 1 - t ) * p[ 2 ] + ( 1 - t ) * ( 1 - t ) * ( 1 - t ) * p[ 3 ] );

	}

	function getV( t, p ) {

		return ( t * t * t * p[ 0 ] + 3 * t * t * ( 1 - t ) * p[ 1 ] + 3 * t * ( 1 - t ) * ( 1 - t ) * p[ 2 ] + ( 1 - t ) * ( 1 - t ) * ( 1 - t ) * p[ 3 ] );

	}

	function getVertex( u, v, p ) {

		const vertex = new Vector3();
		const q = [];

		for ( let i = 0; i < 4; i ++ ) {

			q[ i ] = new Vector3( getU( u, [ p[ i ][ 0 ][ 0 ], p[ i ][ 1 ][ 0 ], p[ i ][ 2 ][ 0 ], p[ i ][ 3 ][ 0 ] ] ), getU( u, [ p[ i ][ 0 ][ 1 ], p[ i ][ 1 ][ 1 ], p[ i ][ 2 ][ 1 ], p[ i ][ 3 ][ 1 ] ] ), getU( u, [ p[ i ][ 0 ][ 2 ], p[ i ][ 1 ][ 2 ], p[ i ][ 2 ][ 2 ], p[ i ][ 3 ][ 2 ] ] ) );

		}

		vertex.set( getV( v, [ q[ 0 ].x, q[ 1 ].x, q[ 2 ].x, q[ 3 ].x ] ), getV( v, [ q[ 0 ].y, q[ 1 ].y, q[ 2 ].y, q[ 3 ].y ] ), getV( v, [ q[ 0 ].z, q[ 1 ].z, q[ 2 ].z, q[ 3 ].z ] ) );

		return vertex;

	}

	function getNormal( u, v, p ) {

		const tangentU = new Vector3();
		const tangentV = new Vector3();
		const normal = new Vector3();

		const q = [];

		for ( let i = 0; i < 4; i ++ ) {

			q[ i ] = new Vector3( getU( u, [ p[ i ][ 0 ][ 0 ], p[ i ][ 1 ][ 0 ], p[ i ][ 2 ][ 0 ], p[ i ][ 3 ][ 0 ] ] ), getU( u, [ p[ i ][ 0 ][ 1 ], p[ i ][ 1 ][ 1 ], p[ i ][ 2 ][ 1 ], p[ i ][ 3 ][ 1 ] ] ), getU( u, [ p[ i ][ 0 ][ 2 ], p[ i ][ 1 ][ 2 ], p[ i ][ 2 ][ 2 ], p[ i ][ 3 ][ 2 ] ] ) );

		}

		tangentV.set( getV( v, [ q[ 1 ].x - q[ 0 ].x, q[ 2 ].x - q[ 1 ].x, q[ 3 ].x - q[ 2 ].x, 0 ] ), getV( v, [ q[ 1 ].y - q[ 0 ].y, q[ 2 ].y - q[ 1 ].y, q[ 3 ].y - q[ 2 ].y, 0 ] ), getV( v, [ q[ 1 ].z - q[ 0 ].z, q[ 2 ].z - q[ 1 ].z, q[ 3 ].z - q[ 2 ].z, 0 ] ) );

		for ( let i = 0; i < 4; i ++ ) {

			q[ i ] = new Vector3( getV( v, [ p[ 0 ][ i ][ 0 ], p[ 1 ][ i ][ 0 ], p[ 2 ][ i ][ 0 ], p[ 3 ][ i ][ 0 ] ] ), getV( v, [ p[ 0 ][ i ][ 1 ], p[ 1 ][ i ][ 1 ], p[ 2 ][ i ][ 1 ], p[ 3 ][ i ][ 1 ] ] ), getV( v, [ p[ 0 ][ i ][ 2 ], p[ 1 ][ i ][ 2 ], p[ 2 ][ i ][ 2 ], p[ 3 ][ i ][ 2 ] ] ) );

		}

		tangentU.set( getU( u, [ q[ 1 ].x - q[ 0 ].x, q[ 2 ].x - q[ 1 ].x, q[ 3 ].x - q[ 2 ].x, 0 ] ), getU( u, [ q[ 1 ].y - q[ 0 ].y, q[ 2 ].y - q[ 1 ].y, q[ 3 ].y - q[ 2 ].y, 0 ] ), getU( u, [ q[ 1 ].z - q[ 0 ].z, q[ 2 ].z - q[ 1 ].z, q[ 3 ].z - q[ 2 ].z, 0 ] ) );

		normal.crossVectors( tangentU, tangentV );

		if ( this.blinn ) {

			normal.multiplyScalar( - 1 );

		}

		return normal.normalize();

	}

	function generate() {

		let p, normal;

		const teacup = [
			[ // body
				[ - 1.5, 0, 2.4, 1 ],
				[ - 1.5, - 0.8, 2.4, 1 ],
				[ - 0.8, - 1.5, 2.4, 1 ],
				[ 0, - 1.5, 2.4, 1 ],
				[ - 1.5, 0, 1.8, 1 ],
				[ - 1.5, - 0.8, 1.8, 1 ],
				[ - 0.8, - 1.5, 1.8, 1 ],
				[ 0, - 1.5, 1.8, 1 ],
				[ - 1.5, 0, 1.2, 1 ],
				[ - 1.5, - 0.8, 1.2, 1 ],
				[ - 0.8, - 1.5, 1.2, 1 ],
				[ 0, - 1.5, 1.2, 1 ],
				[ - 1.5, 0, 0.6, 1 ],
				[ - 1.5, - 0.8, 0.6, 1 ],
				[ - 0.8, - 1.5, 0.6, 1 ],
				[ 0, - 1.5, 0.6, 1 ],
				[ - 1.5, 0, 0, 1 ],
				[ - 1.5, - 0.8, 0, 1 ],
				[ - 0.8, - 1.5, 0, 1 ],
				[ 0, - 1.5, 0, 1 ]
			],
			[ // lid
				[ 1.5, 0, 2.4, 1 ],
				[ 1.5, - 0.8, 2.4, 1 ],
				[ 0.8, - 1.5, 2.4, 1 ],
				[ 0, - 1.5, 2.4, 1 ],
				[ 1.5, 0, 1.8, 1 ],
				[ 1.5, - 0.8, 1.8, 1 ],
				[ 0.8, - 1.5, 1.8, 1 ],
				[ 0, - 1.5, 1.8, 1 ],
				[ 1.5, 0, 1.2, 1 ],
				[ 1.5, - 0.8, 1.2, 1 ],
				[ 0.8, - 1.5, 1.2, 1 ],
				[ 0, - 1.5, 1.2, 1 ],
				[ 1.5, 0, 0.6, 1 ],
				[ 1.5, - 0.8, 0.6, 1 ],
				[ 0.8, - 1.5, 0.6, 1 ],
				[ 0, - 1.5, 0.6, 1 ],
				[ 0, 0, 0, 1 ],
				[ 0, - 0.8, 0, 1 ],
				[ 0.8, - 1.5, 0, 1 ],
				[ 0, - 1.5, 0, 1 ]
			],
			[ // handle
				[ 1.5, 0, 2.4, 1 ],
				[ 1.5, - 0.8, 2.4, 1 ],
				[ 0.8, - 1.5, 2.4, 1 ],
				[ 0, - 1.5, 2.4, 1 ],
				[ 1.5, 0, 1.8, 1 ],
				[ 1.5, - 0.8, 1.8, 1 ],
				[ 0.8, - 1.5, 1.8, 1 ],
				[ 0, - 1.5, 1.8, 1 ],
				[ 1.5, 0, 1.2, 1 ],
				[ 1.5, - 0.8, 1.2, 1 ],
				[ 0.8, - 1.5, 1.2, 1 ],
				[ 0, - 1.5, 1.2, 1 ],
				[ 1.5, 0, 0.6, 1 ],
				[ 1.5, - 0.8, 0.6, 1 ],
				[ 0.8, - 1.5, 0.6, 1 ],
				[ 0, - 1.5, 0.6, 1 ],
				[ 1.5, 0, 0, 1 ],
				[ 1.5, - 0.8, 0, 1 ],
				[ 0.8, - 1.5, 0, 1 ],
				[ 0, - 1.5, 0, 1 ]
			],
			[ // spout
				[ - 1.5, 0, 2.4, 1 ],
				[ - 1.5, - 0.8, 2.4, 1 ],
				[ - 0.8, - 1.5, 2.4, 1 ],
				[ 0, - 1.5, 2.4, 1 ],
				[ - 1.5, 0, 1.8, 1 ],
				[ - 1.5, - 0.8, 1.8, 1 ],
				[ - 0.8, - 1.5, 1.8, 1 ],
				[ 0, - 1.5, 1.8, 1 ],
				[ - 1.5, 0, 1.2, 1 ],
				[ - 1.5, - 0.8, 1.2, 1 ],
				[ - 0.8, - 1.5, 1.2, 1 ],
				[ 0, - 1.5, 1.2, 1 ],
				[ - 1.5, 0, 0.6, 1 ],
				[ - 1.5, - 0.8, 0.6, 1 ],
				[ - 0.8, - 1.5, 0.6, 1 ],
				[ 0, - 1.5, 0.6, 1 ],
				[ - 1.5, 0, 0, 1 ],
				[ - 1.5, - 0.8, 0, 1 ],
				[ - 0.8, - 1.5, 0, 1 ],
				[ 0, - 1.5, 0, 1 ]
			]
		];

		for ( let i = 0; i < patch.length; i ++ ) {

			for ( let j = 0; j < patch[ i ].length; j ++ ) {

				p = [];

				for ( let k = 0; k < patch[ i ][ j ].length; k ++ ) {

					p.push( teacup[ i ][ patch[ i ][ j ][ k ] ] );

				}

				for ( let k = 0; k <= this.segments; k ++ ) {

					for ( let l = 0; l <= this.segments; l ++ ) {

						v.copy( getVertex( k / this.segments, l / this.segments, p ) );
						vertices.push( v.x, v.y, v.z );

						normal = getNormal( k / this.segments, l / this.segments, p );
						normals.push( normal.x, normal.y, normal.z );

					}

				}

			}

		}

		for ( let i = 0; i < patch.length; i ++ ) {

			for ( let j = 0; j < patch[ i ].length; j ++ ) {

				for ( let k = 0; k < this.segments; k ++ ) {

					for ( let l = 0; l < this.segments; l ++ ) {

						const a = i * ( this.segments + 1 ) * ( this.segments + 1 ) * patch[ 0 ].length + j * ( this.segments + 1 ) * ( this.segments + 1 ) + k * ( this.segments + 1 ) + l;
						const b = a + 1;
						const c = a + this.segments + 1;
						const d = c + 1;

						indices.push( a, b, c );
						indices.push( b, d, c );

					}

				}

			}

		}

		this.setAttribute( 'position', new BufferAttribute( new Float32Array( vertices ), 3 ) );
		this.setAttribute( 'normal', new BufferAttribute( new Float32Array( normals ), 3 ) );
		this.setIndex( new BufferAttribute( new Uint16Array( indices ), 1 ) );

	}

	generate();

};

TeapotGeometry.prototype = Object.create( BufferGeometry.prototype );
TeapotGeometry.prototype.constructor = TeapotGeometry;

export { TeapotGeometry };