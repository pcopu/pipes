
import {
    BufferGeometry,
    FileLoader,
    Float32BufferAttribute,
    Group,
    LineBasicMaterial,
    LineSegments,
    Loader,
    Mesh,
    MeshPhongMaterial,
    Points,
    PointsMaterial,
    Vector3
} from 'three';

class OBJLoader extends Loader {

    constructor( manager ) {

        super( manager );

        this.materials = null;

    }

    load( url, onLoad, onProgress, onError ) {

        const scope = this;

        const loader = new FileLoader( this.manager );
        loader.setPath( this.path );
        loader.setRequestHeader( this.requestHeader );
        loader.setWithCredentials( this.withCredentials );
        loader.load( url, function ( text ) {

            try {

                onLoad( scope.parse( text ) );

            } catch ( e ) {

                if ( onError ) {

                    onError( e );

                } else {

                    console.error( e );

                }

                scope.manager.itemError( url );

            }

        }, onProgress, onError );

    }

    setMaterials( materials ) {

        this.materials = materials;

        return this;

    }

    parse( text ) {

        const state = {
            objects: [],
            object: {},

            vertices: [],
            normals: [],
            colors: [],
            uvs: [],

            materialLibraries: [],

            startObject: function ( name, fromDeclaration ) {

                if ( this.object && this.object.fromDeclaration === false ) {

                    this.object.name = name;
                    this.object.fromDeclaration = ( fromDeclaration !== false );
                    return;

                }

                if ( this.object && typeof this.object.currentMaterial === 'function' ) {

                    this.object.currentMaterial( {
                        smooth: true,
                        groupTemp: new Group()
                    } );

                }

                const object = {
                    name: name || '',
                    fromDeclaration: ( fromDeclaration !== false ),

                    geometry: {
                        vertices: [],
                        normals: [],
                        colors: [],
                        uvs: [],
                        hasUVIndices: false
                    },
                    materials: [],
                    smooth: true,

                    startGroup: function ( name ) {

                        const group = {
                            name: name,
                            materials: [],
                            smooth: true,
                            groupTemp: new Group()
                        };

                        this.materials.push( group );

                    },

                    currentMaterial: function ( material ) {

                        if ( this.materials.length > 0 ) {

                            const lastMaterial = this.materials[ this.materials.length - 1 ];
                            if ( lastMaterial.groupTemp.children.length > 0 ) {

                                const group = new Group();
                                group.name = lastMaterial.name;
                                lastMaterial.groupTemp.children.forEach( function ( child ) {

                                    group.add( child );

                                } );
                                this.geometry.groups.push( group );

                            }

                        }

                        this.materials.push( material );

                    }
                };

                this.objects.push( object );
                this.object = object;

            },

            finalize: function () {

                if ( this.object && typeof this.object.currentMaterial === 'function' ) {

                    this.object.currentMaterial( {
                        smooth: true,
                        groupTemp: new Group()
                    } );

                }

            },

            parseVertexIndex: function ( value, len ) {

                const index = parseInt( value, 10 );
                return ( index >= 0 ? index - 1 : index + len / 3 ) * 3;

            },

            parseNormalIndex: function ( value, len ) {

                const index = parseInt( value, 10 );
                return ( index >= 0 ? index - 1 : index + len / 3 ) * 3;

            },

            parseUVIndex: function ( value, len ) {

                const index = parseInt( value, 10 );
                return ( index >= 0 ? index - 1 : index + len / 2 ) * 2;

            },

            addVertex: function ( a, b, c ) {

                const src = this.vertices;
                const dst = this.object.geometry.vertices;

                dst.push( src[ a + 0 ], src[ a + 1 ], src[ a + 2 ] );
                dst.push( src[ b + 0 ], src[ b + 1 ], src[ b + 2 ] );
                dst.push( src[ c + 0 ], src[ c + 1 ], src[ c + 2 ] );

            },

            addVertexPoint: function ( a ) {

                const src = this.vertices;
                const dst = this.object.geometry.vertices;

                dst.push( src[ a + 0 ], src[ a + 1 ], src[ a + 2 ] );

            },

            addVertexLine: function ( a ) {

                const src = this.vertices;
                const dst = this.object.geometry.vertices;

                dst.push( src[ a + 0 ], src[ a + 1 ], src[ a + 2 ] );

            },

            addNormal: function ( a, b, c ) {

                const src = this.normals;
                const dst = this.object.geometry.normals;

                dst.push( src[ a + 0 ], src[ a + 1 ], src[ a + 2 ] );
                dst.push( src[ b + 0 ], src[ b + 1 ], src[ b + 2 ] );
                dst.push( src[ c + 0 ], src[ c + 1 ], src[ c + 2 ] );

            },

            addFaceNormal: function ( a, b, c ) {

                const src = this.vertices;
                const dst = this.object.geometry.normals;

                const vA = new Vector3();
                const vB = new Vector3();
                const vC = new Vector3();

                vA.fromArray( src, a );
                vB.fromArray( src, b );
                vC.fromArray( src, c );

                const cb = new Vector3();
                const ab = new Vector3();

                cb.subVectors( vC, vB );
                ab.subVectors( vA, vB );
                cb.cross( ab );

                cb.normalize();

                dst.push( cb.x, cb.y, cb.z );
                dst.push( cb.x, cb.y, cb.z );
                dst.push( cb.x, cb.y, cb.z );

            },

            addColor: function ( a, b, c ) {

                const src = this.colors;
                const dst = this.object.geometry.colors;

                if ( src[ a ] !== undefined ) dst.push( src[ a + 0 ], src[ a + 1 ], src[ a + 2 ] );
                if ( src[ b ] !== undefined ) dst.push( src[ b + 0 ], src[ b + 1 ], src[ b + 2 ] );
                if ( src[ c ] !== undefined ) dst.push( src[ c + 0 ], src[ c + 1 ], src[ c + 2 ] );

            },

            addUV: function ( a, b, c ) {

                const src = this.uvs;
                const dst = this.object.geometry.uvs;

                dst.push( src[ a + 0 ], src[ a + 1 ] );
                dst.push( src[ b + 0 ], src[ b + 1 ] );
                dst.push( src[ c + 0 ], src[ c + 1 ] );

            },

            addUVLine: function ( a ) {

                const src = this.uvs;
                const dst = this.object.geometry.uvs;

                dst.push( src[ a + 0 ], src[ a + 1 ] );

            },

            addFace: function ( a, b, c, ua, ub, uc, na, nb, nc ) {

                const vLen = this.vertices.length;

                let ia = this.parseVertexIndex( a, vLen );
                let ib = this.parseVertexIndex( b, vLen );
                let ic = this.parseVertexIndex( c, vLen );

                this.addVertex( ia, ib, ic );
                this.addColor( ia, ib, ic );

                if ( ua !== undefined && ua !== '' ) {

                    const uvLen = this.uvs.length;
                    ia = this.parseUVIndex( ua, uvLen );
                    ib = this.parseUVIndex( ub, uvLen );
                    ic = this.parseUVIndex( uc, uvLen );
                    this.addUV( ia, ib, ic );
                    this.object.geometry.hasUVIndices = true;

                }

                if ( na !== undefined && na !== '' ) {

                    const nLen = this.normals.length;
                    ia = this.parseNormalIndex( na, nLen );
                    ib = this.parseNormalIndex( nb, nLen );
                    ic = this.parseNormalIndex( nc, nLen );
                    this.addNormal( ia, ib, ic );

                } else {

                    this.addFaceNormal( ia, ib, ic );

                }

            },

            addPointGeometry: function ( vertices ) {

                this.object.geometry.type = 'Points';

                const buffergeometry = new BufferGeometry();

                buffergeometry.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );

                if ( this.colors.length > 0 ) {

                    buffergeometry.setAttribute( 'color', new Float32BufferAttribute( this.colors, 3 ) );

                }

                this.object.geometry.buffergeometry = buffergeometry;

            },

            addLineGeometry: function ( vertices, uvs ) {

                this.object.geometry.type = 'Line';

                const buffergeometry = new BufferGeometry();

                buffergeometry.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );

                if ( uvs.length > 0 ) {

                    buffergeometry.setAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

                }

                this.object.geometry.buffergeometry = buffergeometry;

            }

        };

        state.startObject( '', false );

        // v float float float

        const vertex_pattern = /^v\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;

        // vn float float float

        const normal_pattern = /^vn\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;

        // vt float float

        const uv_pattern = /^vt\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;

        // f vertex vertex vertex

        const face_pattern1 = /^f\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)(?:\s+(-?\d+))?/;

        // f vertex/uv vertex/uv vertex/uv

        const face_pattern2 = /^f\s+((-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+))(?:\s+((-?\d+)\/(-?\d+)))?/;

        // f vertex/uv/normal vertex/uv/normal vertex/uv/normal

        const face_pattern3 = /^f\s+((-?\d+)\/(-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+)\/(-?\d+))(?:\s+((-?\d+)\/(-?\d+)\/(-?\d+)))?/;

        // f vertex//normal vertex//normal vertex//normal

        const face_pattern4 = /^f\s+((-?\d+)\/\/(-?\d+))\s+((-?\d+)\/\/(-?\d+))\s+((-?\d+)\/\/(-?\d+))(?:\s+((-?\d+)\/\/(-?\d+)))?/;

        //

        const lines = text.split( '\n' );

        for ( let i = 0, l = lines.length; i < l; i ++ ) {

            const line = lines[ i ].trim();

            let result;

            if ( line.length === 0 || line.charAt( 0 ) === '#' ) {

                continue;

            } else if ( ( result = vertex_pattern.exec( line ) ) !== null ) {

                // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

                state.vertices.push(
                    parseFloat( result[ 1 ] ),
                    parseFloat( result[ 2 ] ),
                    parseFloat( result[ 3 ] )
                );

            } else if ( ( result = normal_pattern.exec( line ) ) !== null ) {

                // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

                state.normals.push(
                    parseFloat( result[ 1 ] ),
                    parseFloat( result[ 2 ] ),
                    parseFloat( result[ 3 ] )
                );

            } else if ( ( result = uv_pattern.exec( line ) ) !== null ) {

                // ["vt 0.1 0.2", "0.1", "0.2"]

                state.uvs.push(
                    parseFloat( result[ 1 ] ),
                    parseFloat( result[ 2 ] )
                );

            } else if ( ( result = face_pattern1.exec( line ) ) !== null ) {

                // ["f 1 2 3", "1", "2", "3", undefined]

                state.addFace(
                    result[ 1 ], result[ 2 ], result[ 3 ],
                    undefined, undefined, undefined,
                    undefined, undefined, undefined
                );

                if ( result[ 4 ] !== undefined ) {

                    state.addFace(
                        result[ 1 ], result[ 3 ], result[ 4 ],
                        undefined, undefined, undefined,
                        undefined, undefined, undefined
                    );

                }

            } else if ( ( result = face_pattern2.exec( line ) ) !== null ) {

                // ["f 1/1 2/2 3/3", "1/1", "1", "1", "2/2", "2", "2", "3/3", "3", "3", undefined, undefined, undefined]

                state.addFace(
                    result[ 2 ], result[ 5 ], result[ 8 ],
                    result[ 3 ], result[ 6 ], result[ 9 ],
                    undefined, undefined, undefined
                );

                if ( result[ 11 ] !== undefined ) {

                    state.addFace(
                        result[ 2 ], result[ 8 ], result[ 11 ],
                        result[ 3 ], result[ 9 ], result[ 12 ],
                        undefined, undefined, undefined
                    );

                }

            } else if ( ( result = face_pattern3.exec( line ) ) !== null ) {

                // ["f 1/1/1 2/2/2 3/3/3", "1/1/1", "1", "1", "1", "2/2/2", "2", "2", "2", "3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]

                state.addFace(
                    result[ 2 ], result[ 6 ], result[ 10 ],
                    result[ 3 ], result[ 7 ], result[ 11 ],
                    result[ 4 ], result[ 8 ], result[ 12 ]
                );

                if ( result[ 14 ] !== undefined ) {

                    state.addFace(
                        result[ 2 ], result[ 10 ], result[ 14 ],
                        result[ 3 ], result[ 11 ], result[ 15 ],
                        result[ 4 ], result[ 12 ], result[ 16 ]
                    );

                }

            } else if ( ( result = face_pattern4.exec( line ) ) !== null ) {

                // ["f 1//1 2//2 3//3", "1//1", "1", "1", "2//2", "2", "2", "3//3", "3", "3", undefined, undefined, undefined]

                state.addFace(
                    result[ 2 ], result[ 5 ], result[ 8 ],
                    undefined, undefined, undefined,
                    result[ 3 ], result[ 6 ], result[ 9 ]
                );

                if ( result[ 11 ] !== undefined ) {

                    state.addFace(
                        result[ 2 ], result[ 8 ], result[ 11 ],
                        undefined, undefined, undefined,
                        result[ 3 ], result[ 9 ], result[ 12 ]
                    );

                }

            } else if ( /^o /.test( line ) ) {

                state.startObject( line.substring( 2 ).trim() );

            } else if ( /^g /.test( line ) ) {

                state.startGroup( line.substring( 2 ).trim() );

            } else if ( /^usemtl /.test( line ) ) {

                state.object.currentMaterial( {
                    name: line.substring( 7 ).trim(),
                    smooth: state.object.smooth,
                    groupTemp: new Group()
                } );

            } else if ( /^mtllib /.test( line ) ) {

                state.materialLibraries.push( line.substring( 7 ).trim() );

            } else if ( /^s /.test( line ) ) {

                const value = line.substring( 2 ).trim();
                state.object.smooth = ( value !== 'off' && value !== '0' );

            } else {

                // Handle unsupported commands

            }

        }

        state.finalize();

        const container = new Group();
        container.materialLibraries = state.materialLibraries;

        for ( let i = 0, l = state.objects.length; i < l; i ++ ) {

            const object = state.objects[ i ];
            const geometry = object.geometry;
            const materials = object.materials;
            const isLine = ( geometry.type === 'Line' );
            const isPoints = ( geometry.type === 'Points' );
            let hasVertexColors = false;

            // Skip o/g line declarations that did not follow the spec containing geometry definitions

            if ( geometry.vertices.length === 0 ) continue;

            const buffergeometry = new BufferGeometry();

            buffergeometry.setAttribute( 'position', new Float32BufferAttribute( geometry.vertices, 3 ) );

            if ( geometry.normals.length > 0 ) {

                buffergeometry.setAttribute( 'normal', new Float32BufferAttribute( geometry.normals, 3 ) );

            }

            if ( geometry.colors.length > 0 ) {

                hasVertexColors = true;
                buffergeometry.setAttribute( 'color', new Float32BufferAttribute( geometry.colors, 3 ) );

            }

            if ( geometry.hasUVIndices === true ) {

                buffergeometry.setAttribute( 'uv', new Float32BufferAttribute( geometry.uvs, 2 ) );

            }

            // Create materials

            const createdMaterials = [];

            for ( let mi = 0, ml = materials.length; mi < ml; mi ++ ) {

                const sourceMaterial = materials[ mi ];
                const material = new MeshPhongMaterial();
                material.name = sourceMaterial.name;
                material.flatShading = sourceMaterial.smooth ? false : true;
                material.vertexColors = hasVertexColors;
                createdMaterials.push( material );

            }

            // Create mesh

            let mesh;

            if ( createdMaterials.length > 1 ) {

                for ( let mi = 0, ml = materials.length; mi < ml; mi ++ ) {

                    const sourceMaterial = materials[ mi ];
                    const material = createdMaterials[ mi ];

                    const group = new Group();
                    group.name = sourceMaterial.name;
                    sourceMaterial.groupTemp.children.forEach( function ( child ) {

                        group.add( child );

                    } );

                    const submesh = new Mesh( buffergeometry, material );
                    submesh.name = sourceMaterial.name;
                    group.add( submesh );
                    container.add( group );

                }

            } else {

                if ( isLine ) {

                    mesh = new LineSegments( buffergeometry, createdMaterials[ 0 ] );

                } else if ( isPoints ) {

                    mesh = new Points( buffergeometry, createdMaterials[ 0 ] );

                } else {

                    mesh = new Mesh( buffergeometry, createdMaterials[ 0 ] );

                }

                mesh.name = object.name;

                container.add( mesh );

            }

        }

        return container;

    }

}

export { OBJLoader };
