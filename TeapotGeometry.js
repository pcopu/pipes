import {
    BufferGeometry,
    Float32BufferAttribute,
    Vector3
} from 'three';

// Utah Teapot
// https://www.cs.utah.edu/~dejohnso/models/teapot.zip

// The teapot data was modified to be more compact and easier to parse
// http://www.sjbaker.org/wiki/index.php?title=The_History_of_The_Teapot

class TeapotGeometry extends BufferGeometry {

    constructor( size = 1, segments = 10, bottom = true, lid = true, body = true, fitLid = false, blinn = true ) {

        super();

        this.type = 'TeapotGeometry';

        this.parameters = {
            size: size,
            segments: segments,
            bottom: bottom,
            lid: lid,
            body: body,
            fitLid: fitLid,
            blinn: blinn
        };

        const scope = this;

        // parts

        this.vertices = [];
        this.normals = [];
        this.indices = [];

        // variables

        let v, n, i, j, k, l, m, p, q, r, s, t, u, v_;

        // constants

        const size_ = size;
        const segments_ = segments;
        const bottom_ = bottom;
        const lid_ = lid;
        const body_ = body;
        const fitLid_ = fitLid;
        const blinn_ = blinn;

        // control points

        const cp = [
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
            [ 0, - 1.5, 0, 1 ],
            [ 1.5, 0, - 0.6, 1 ],
            [ 1.5, - 0.8, - 0.6, 1 ],
            [ 0.8, - 1.5, - 0.6, 1 ],
            [ 0, - 1.5, - 0.6, 1 ],
            [ 1.5, 0, - 1.2, 1 ],
            [ 1.5, - 0.8, - 1.2, 1 ],
            [ 0.8, - 1.5, - 1.2, 1 ],
            [ 0, - 1.5, - 1.2, 1 ],
            [ 1.5, 0, - 1.8, 1 ],
            [ 1.5, - 0.8, - 1.8, 1 ],
            [ 0.8, - 1.5, - 1.8, 1 ],
            [ 0, - 1.5, - 1.8, 1 ],
            [ 1.5, 0, - 2.4, 1 ],
            [ 1.5, - 0.8, - 2.4, 1 ],
            [ 0.8, - 1.5, - 2.4, 1 ],
            [ 0, - 1.5, - 2.4, 1 ],
            [ 0, 0, 2.4, 1 ],
            [ 0, - 0.8, 2.4, 1 ],
            [ 0.8, - 1.5, 2.4, 1 ],
            [ 0, - 1.5, 2.4, 1 ],
            [ 0, 0, 1.8, 1 ],
            [ 0, - 0.8, 1.8, 1 ],
            [ 0.8, - 1.5, 1.8, 1 ],
            [ 0, - 1.5, 1.8, 1 ],
            [ 0, 0, 1.2, 1 ],
            [ 0, - 0.8, 1.2, 1 ],
            [ 0.8, - 1.5, 1.2, 1 ],
            [ 0, - 1.5, 1.2, 1 ],
            [ 0, 0, 0.6, 1 ],
            [ 0, - 0.8, 0.6, 1 ],
            [ 0.8, - 1.5, 0.6, 1 ],
            [ 0, - 1.5, 0.6, 1 ],
            [ 0, 0, 0, 1 ],
            [ 0, - 0.8, 0, 1 ],
            [ 0.8, - 1.5, 0, 1 ],
            [ 0, - 1.5, 0, 1 ],
            [ 0, 0, - 0.6, 1 ],
            [ 0, - 0.8, - 0.6, 1 ],
            [ 0.8, - 1.5, - 0.6, 1 ],
            [ 0, - 1.5, - 0.6, 1 ],
            [ 0, 0, - 1.2, 1 ],
            [ 0, - 0.8, - 1.2, 1 ],
            [ 0.8, - 1.5, - 1.2, 1 ],
            [ 0, - 1.5, - 1.2, 1 ],
            [ 0, 0, - 1.8, 1 ],
            [ 0, - 0.8, - 1.8, 1 ],
            [ 0.8, - 1.5, - 1.8, 1 ],
            [ 0, - 1.5, - 1.8, 1 ],
            [ 0, 0, - 2.4, 1 ],
            [ 0, - 0.8, - 2.4, 1 ],
            [ 0.8, - 1.5, - 2.4, 1 ],
            [ 0, - 1.5, - 2.4, 1 ],
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
            [ 0, - 1.5, 0, 1 ],
            [ - 1.5, 0, - 0.6, 1 ],
            [ - 1.5, - 0.8, - 0.6, 1 ],
            [ - 0.8, - 1.5, - 0.6, 1 ],
            [ 0, - 1.5, - 0.6, 1 ],
            [ - 1.5, 0, - 1.2, 1 ],
            [ - 1.5, - 0.8, - 1.2, 1 ],
            [ - 0.8, - 1.5, - 1.2, 1 ],
            [ 0, - 1.5, - 1.2, 1 ],
            [ - 1.5, 0, - 1.8, 1 ],
            [ - 1.5, - 0.8, - 1.8, 1 ],
            [ - 0.8, - 1.5, - 1.8, 1 ],
            [ 0, - 1.5, - 1.8, 1 ],
            [ - 1.5, 0, - 2.4, 1 ],
            [ - 1.5, - 0.8, - 2.4, 1 ],
            [ - 0.8, - 1.5, - 2.4, 1 ],
            [ 0, - 1.5, - 2.4, 1 ]
        ];

        const indices_ = [
            // Body
            [ 102, 103, 104, 105, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ],
            [ 3, 2, 1, 0, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27 ],
            [ 110, 111, 112, 113, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39 ],
            [ 109, 108, 107, 106, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51 ],
            [ 1, 2, 3, 4, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63 ],
            [ 114, 115, 116, 117, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75 ],
            [ 118, 119, 120, 121, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87 ],
            [ 122, 123, 124, 125, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99 ],
            [ 126, 127, 128, 129, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111 ],

            // Lid
            [ 0, 1, 2, 3, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123 ],
            [ 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139 ],
            [ 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155 ],
            [ 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171 ],

            // Handle
            [ 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187 ],
            [ 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203 ],

            // Spout
            [ 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219 ],
            [ 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235 ]
        ];

        // Bezier basis functions

        function basis( t, p ) {

            const d = 1 - t;

            return [
                d * d * d,
                3 * d * d * t,
                3 * d * t * t,
                t * t * t
            ];

        }

        // Bezier curve

        function bezier( t, p ) {

            const b = basis( t );
            const v = new Vector3();

            for ( let i = 0; i < 4; i ++ ) {

                v.addScaledVector( p[ i ], b[ i ] );

            }

            return v;

        }

        // Bezier patch

        function patch( u, v, p ) {

            const q = [];

            for ( let i = 0; i < 4; i ++ ) {

                q.push( bezier( u, p[ i ] ) );

            }

            return bezier( v, q );

        }

        // Bezier patch normal

        function normal( u, v, p ) {

            const q = [];
            const r = [];

            for ( let i = 0; i < 4; i ++ ) {

                q.push( bezier( u, p[ i ] ) );
                r.push( bezier( v, [ p[ 0 ][ i ], p[ 1 ][ i ], p[ 2 ][ i ], p[ 3 ][ i ] ] ) );

            }

            const du = new Vector3();
            const dv = new Vector3();

            du.subVectors( q[ 1 ], q[ 0 ] ).multiplyScalar( 3 );
            dv.subVectors( r[ 1 ], r[ 0 ] ).multiplyScalar( 3 );

            return du.cross( dv ).normalize();

        }

        // build geometry

        function build() {

            let p, q, r, s, t, u, v_;

            for ( i = 0; i < indices_.length; i ++ ) {

                p = indices_[ i ];

                q = [];

                for ( j = 0; j < 16; j ++ ) {

                    q.push( new Vector3( cp[ p[ j ] ][ 0 ], cp[ p[ j ] ][ 1 ], cp[ p[ j ] ][ 2 ] ) );

                }

                r = [];

                for ( j = 0; j < 4; j ++ ) {

                    r.push( [ q[ j * 4 + 0 ], q[ j * 4 + 1 ], q[ j * 4 + 2 ], q[ j * 4 + 3 ] ] );

                }

                for ( j = 0; j <= segments_; j ++ ) {

                    for ( k = 0; k <= segments_; k ++ ) {

                        s = patch( j / segments_, k / segments_, r );
                        t = normal( j / segments_, k / segments_, r );

                        scope.vertices.push( s.x, s.y, s.z );
                        scope.normals.push( t.x, t.y, t.z );

                    }

                }

            }

            for ( i = 0; i < indices_.length; i ++ ) {

                p = i * ( segments_ + 1 ) * ( segments_ + 1 );

                for ( j = 0; j < segments_; j ++ ) {

                    for ( k = 0; k < segments_; k ++ ) {

                        q = p + j * ( segments_ + 1 ) + k;
                        r = p + ( j + 1 ) * ( segments_ + 1 ) + k;

                        scope.indices.push( q, r, q + 1 );
                        scope.indices.push( r, r + 1, q + 1 );

                    }

                }

            }

        }

        build();

        // set attributes

        this.setAttribute( 'position', new Float32BufferAttribute( this.vertices, 3 ) );
        this.setAttribute( 'normal', new Float32BufferAttribute( this.normals, 3 ) );
        this.setIndex( this.indices );

    }

}

export { TeapotGeometry };