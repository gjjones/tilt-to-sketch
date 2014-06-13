/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

 window.THREE = window.THREE || {};

THREE.Math = {

	// Clamp value to range <a, b>

	clamp: function ( x, a, b ) {

		return ( x < a ) ? a : ( ( x > b ) ? b : x );

	},

	degToRad: function() {

		var degreeToRadiansFactor = Math.PI / 180;

		return function ( degrees ) {

			return degrees * degreeToRadiansFactor;

		};

	}(),

	radToDeg: function() {

		var radianToDegreesFactor = 180 / Math.PI;

		return function ( radians ) {

			return radians * radianToDegreesFactor;

		};

	}(),

};

THREE.Euler = function ( x, y, z, order ) {

  this._x = x || 0;
  this._y = y || 0;
  this._z = z || 0;
  this._order = order || THREE.Euler.DefaultOrder;

};


THREE.Euler.RotationOrders = [ 'XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX' ];

THREE.Euler.DefaultOrder = 'XYZ';

THREE.Euler.prototype = {

  constructor: THREE.Euler,

  _x: 0, _y: 0, _z: 0, _order: THREE.Euler.DefaultOrder,

  get x () {

    return this._x;

  },

  set x ( value ) {

    this._x = value;
    this.onChangeCallback();

  },

  get y () {

    return this._y;

  },

  set y ( value ) {

    this._y = value;
    this.onChangeCallback();

  },

  get z () {

    return this._z;

  },

  set z ( value ) {

    this._z = value;
    this.onChangeCallback();

  },

  get order () {

    return this._order;

  },

  set order ( value ) {

    this._order = value;
    this.onChangeCallback();

  },

  set: function ( x, y, z, order ) {

    this._x = x;
    this._y = y;
    this._z = z;
    this._order = order || this._order;

    this.onChangeCallback();

    return this;

  },

  copy: function ( euler ) {

    this._x = euler._x;
    this._y = euler._y;
    this._z = euler._z;
    this._order = euler._order;

    this.onChangeCallback();

    return this;

  },

  setFromRotationMatrix: function ( m, order ) {

    var clamp = THREE.Math.clamp;

    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

    var te = m.elements;
    var m11 = te[0], m12 = te[4], m13 = te[8];
    var m21 = te[1], m22 = te[5], m23 = te[9];
    var m31 = te[2], m32 = te[6], m33 = te[10];

    order = order || this._order;

    if ( order === 'XYZ' ) {

      this._y = Math.asin( clamp( m13, -1, 1 ) );

      if ( Math.abs( m13 ) < 0.99999 ) {

        this._x = Math.atan2( - m23, m33 );
        this._z = Math.atan2( - m12, m11 );

      } else {

        this._x = Math.atan2( m32, m22 );
        this._z = 0;

      }

    } else if ( order === 'YXZ' ) {

      this._x = Math.asin( - clamp( m23, -1, 1 ) );

      if ( Math.abs( m23 ) < 0.99999 ) {

        this._y = Math.atan2( m13, m33 );
        this._z = Math.atan2( m21, m22 );

      } else {

        this._y = Math.atan2( - m31, m11 );
        this._z = 0;

      }

    } else if ( order === 'ZXY' ) {

      this._x = Math.asin( clamp( m32, -1, 1 ) );

      if ( Math.abs( m32 ) < 0.99999 ) {

        this._y = Math.atan2( - m31, m33 );
        this._z = Math.atan2( - m12, m22 );

      } else {

        this._y = 0;
        this._z = Math.atan2( m21, m11 );

      }

    } else if ( order === 'ZYX' ) {

      this._y = Math.asin( - clamp( m31, -1, 1 ) );

      if ( Math.abs( m31 ) < 0.99999 ) {

        this._x = Math.atan2( m32, m33 );
        this._z = Math.atan2( m21, m11 );

      } else {

        this._x = 0;
        this._z = Math.atan2( - m12, m22 );

      }

    } else if ( order === 'YZX' ) {

      this._z = Math.asin( clamp( m21, -1, 1 ) );

      if ( Math.abs( m21 ) < 0.99999 ) {

        this._x = Math.atan2( - m23, m22 );
        this._y = Math.atan2( - m31, m11 );

      } else {

        this._x = 0;
        this._y = Math.atan2( m13, m33 );

      }

    } else if ( order === 'XZY' ) {

      this._z = Math.asin( - clamp( m12, -1, 1 ) );

      if ( Math.abs( m12 ) < 0.99999 ) {

        this._x = Math.atan2( m32, m22 );
        this._y = Math.atan2( m13, m11 );

      } else {

        this._x = Math.atan2( - m23, m33 );
        this._y = 0;

      }

    } else {

      console.warn( 'WARNING: Euler.setFromRotationMatrix() given unsupported order: ' + order )

    }

    this._order = order;

    this.onChangeCallback();

    return this;

  },

  onChange: function ( callback ) {

    this.onChangeCallback = callback;

    return this;

  },

  onChangeCallback: function () {}

};


THREE.Matrix4 = function ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {

  this.elements = new Float32Array( 16 );

  // TODO: if n11 is undefined, then just set to identity, otherwise copy all other values into matrix
  //   we should not support semi specification of Matrix4, it is just weird.

  var te = this.elements;

  te[0] = ( n11 !== undefined ) ? n11 : 1; te[4] = n12 || 0; te[8] = n13 || 0; te[12] = n14 || 0;
  te[1] = n21 || 0; te[5] = ( n22 !== undefined ) ? n22 : 1; te[9] = n23 || 0; te[13] = n24 || 0;
  te[2] = n31 || 0; te[6] = n32 || 0; te[10] = ( n33 !== undefined ) ? n33 : 1; te[14] = n34 || 0;
  te[3] = n41 || 0; te[7] = n42 || 0; te[11] = n43 || 0; te[15] = ( n44 !== undefined ) ? n44 : 1;

};

THREE.Matrix4.prototype = {

  constructor: THREE.Matrix4,

  set: function ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {

    var te = this.elements;

    te[0] = n11; te[4] = n12; te[8] = n13; te[12] = n14;
    te[1] = n21; te[5] = n22; te[9] = n23; te[13] = n24;
    te[2] = n31; te[6] = n32; te[10] = n33; te[14] = n34;
    te[3] = n41; te[7] = n42; te[11] = n43; te[15] = n44;

    return this;

  },

  identity: function () {

    this.set(

      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1

    );

    return this;

  },

  copy: function ( m ) {

    this.elements.set( m.elements );

    return this;

  },


  multiplyScalar: function ( s ) {

    var te = this.elements;

    te[0] *= s; te[4] *= s; te[8] *= s; te[12] *= s;
    te[1] *= s; te[5] *= s; te[9] *= s; te[13] *= s;
    te[2] *= s; te[6] *= s; te[10] *= s; te[14] *= s;
    te[3] *= s; te[7] *= s; te[11] *= s; te[15] *= s;

    return this;

  },

  makeRotationFromEuler: function ( euler ) {

    if ( euler instanceof THREE.Euler === false ) {

      console.error( 'ERROR: Matrix\'s .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.  Please update your code.' );

    }

    var te = this.elements;

    var x = euler.x, y = euler.y, z = euler.z;
    var a = Math.cos( x ), b = Math.sin( x );
    var c = Math.cos( y ), d = Math.sin( y );
    var e = Math.cos( z ), f = Math.sin( z );

    if ( euler.order === 'XYZ' ) {

      var ae = a * e, af = a * f, be = b * e, bf = b * f;

      te[0] = c * e;
      te[4] = - c * f;
      te[8] = d;

      te[1] = af + be * d;
      te[5] = ae - bf * d;
      te[9] = - b * c;

      te[2] = bf - ae * d;
      te[6] = be + af * d;
      te[10] = a * c;

    } else if ( euler.order === 'YXZ' ) {

      var ce = c * e, cf = c * f, de = d * e, df = d * f;

      te[0] = ce + df * b;
      te[4] = de * b - cf;
      te[8] = a * d;

      te[1] = a * f;
      te[5] = a * e;
      te[9] = - b;

      te[2] = cf * b - de;
      te[6] = df + ce * b;
      te[10] = a * c;

    } else if ( euler.order === 'ZXY' ) {

      var ce = c * e, cf = c * f, de = d * e, df = d * f;

      te[0] = ce - df * b;
      te[4] = - a * f;
      te[8] = de + cf * b;

      te[1] = cf + de * b;
      te[5] = a * e;
      te[9] = df - ce * b;

      te[2] = - a * d;
      te[6] = b;
      te[10] = a * c;

    } else if ( euler.order === 'ZYX' ) {

      var ae = a * e, af = a * f, be = b * e, bf = b * f;

      te[0] = c * e;
      te[4] = be * d - af;
      te[8] = ae * d + bf;

      te[1] = c * f;
      te[5] = bf * d + ae;
      te[9] = af * d - be;

      te[2] = - d;
      te[6] = b * c;
      te[10] = a * c;

    } else if ( euler.order === 'YZX' ) {

      var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

      te[0] = c * e;
      te[4] = bd - ac * f;
      te[8] = bc * f + ad;

      te[1] = f;
      te[5] = a * e;
      te[9] = - b * e;

      te[2] = - d * e;
      te[6] = ad * f + bc;
      te[10] = ac - bd * f;

    } else if ( euler.order === 'XZY' ) {

      var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

      te[0] = c * e;
      te[4] = - f;
      te[8] = d * e;

      te[1] = ac * f + bd;
      te[5] = a * e;
      te[9] = ad * f - bc;

      te[2] = bc * f - ad;
      te[6] = b * e;
      te[10] = bd * f + ac;

    }

    // last column
    te[3] = 0;
    te[7] = 0;
    te[11] = 0;

    // bottom row
    te[12] = 0;
    te[13] = 0;
    te[14] = 0;
    te[15] = 1;

    return this;

  },

  multiplyMatrices: function ( a, b ) {

    var ae = a.elements;
    var be = b.elements;
    var te = this.elements;

    var a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
    var a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
    var a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
    var a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

    var b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
    var b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
    var b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
    var b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];

    te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

    te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

    te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

    te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    return this;

  },

  getInverse: function ( m, throwOnInvertible ) {

    // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
    var te = this.elements;
    var me = m.elements;

    var n11 = me[0], n12 = me[4], n13 = me[8], n14 = me[12];
    var n21 = me[1], n22 = me[5], n23 = me[9], n24 = me[13];
    var n31 = me[2], n32 = me[6], n33 = me[10], n34 = me[14];
    var n41 = me[3], n42 = me[7], n43 = me[11], n44 = me[15];

    te[0] = n23*n34*n42 - n24*n33*n42 + n24*n32*n43 - n22*n34*n43 - n23*n32*n44 + n22*n33*n44;
    te[4] = n14*n33*n42 - n13*n34*n42 - n14*n32*n43 + n12*n34*n43 + n13*n32*n44 - n12*n33*n44;
    te[8] = n13*n24*n42 - n14*n23*n42 + n14*n22*n43 - n12*n24*n43 - n13*n22*n44 + n12*n23*n44;
    te[12] = n14*n23*n32 - n13*n24*n32 - n14*n22*n33 + n12*n24*n33 + n13*n22*n34 - n12*n23*n34;
    te[1] = n24*n33*n41 - n23*n34*n41 - n24*n31*n43 + n21*n34*n43 + n23*n31*n44 - n21*n33*n44;
    te[5] = n13*n34*n41 - n14*n33*n41 + n14*n31*n43 - n11*n34*n43 - n13*n31*n44 + n11*n33*n44;
    te[9] = n14*n23*n41 - n13*n24*n41 - n14*n21*n43 + n11*n24*n43 + n13*n21*n44 - n11*n23*n44;
    te[13] = n13*n24*n31 - n14*n23*n31 + n14*n21*n33 - n11*n24*n33 - n13*n21*n34 + n11*n23*n34;
    te[2] = n22*n34*n41 - n24*n32*n41 + n24*n31*n42 - n21*n34*n42 - n22*n31*n44 + n21*n32*n44;
    te[6] = n14*n32*n41 - n12*n34*n41 - n14*n31*n42 + n11*n34*n42 + n12*n31*n44 - n11*n32*n44;
    te[10] = n12*n24*n41 - n14*n22*n41 + n14*n21*n42 - n11*n24*n42 - n12*n21*n44 + n11*n22*n44;
    te[14] = n14*n22*n31 - n12*n24*n31 - n14*n21*n32 + n11*n24*n32 + n12*n21*n34 - n11*n22*n34;
    te[3] = n23*n32*n41 - n22*n33*n41 - n23*n31*n42 + n21*n33*n42 + n22*n31*n43 - n21*n32*n43;
    te[7] = n12*n33*n41 - n13*n32*n41 + n13*n31*n42 - n11*n33*n42 - n12*n31*n43 + n11*n32*n43;
    te[11] = n13*n22*n41 - n12*n23*n41 - n13*n21*n42 + n11*n23*n42 + n12*n21*n43 - n11*n22*n43;
    te[15] = n12*n23*n31 - n13*n22*n31 + n13*n21*n32 - n11*n23*n32 - n12*n21*n33 + n11*n22*n33;

    var det = n11 * te[ 0 ] + n21 * te[ 4 ] + n31 * te[ 8 ] + n41 * te[ 12 ];

    if ( det == 0 ) {

      var msg = "Matrix4.getInverse(): can't invert matrix, determinant is 0";

      if ( throwOnInvertible || false ) {

        throw new Error( msg );

      } else {

        console.warn( msg );

      }

      this.identity();

      return this;
    }

    this.multiplyScalar( 1 / det );

    return this;

  },

};
