/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  // throw new Error('Not implemented');
  this.width = width;
  this.height = height;

  this.getArea = function getArea() {
    return this.width * this.height;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  // throw new Error('Not implemented');
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  // throw new Error('Not implemented');
  const obj = JSON.parse(json);
  const values = Object.values(obj);

  return new proto.constructor(...values);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class MyCssSelectorBuilder {
  element(value) {
    if (this.elem) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    if (this.idd) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.elem = `${value}`;

    return this;
  }

  id(value) {
    if (this.idd) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    if (this.classes || this.pseudoElems) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.idd = `#${value}`;

    return this;
  }

  class(value) {
    if (this.classes === undefined) {
      this.classes = new Set();
    }

    if (this.attributes) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.classes.add(`.${value}`);

    return this;
  }

  attr(value) {
    if (this.attributes === undefined) {
      this.attributes = new Set();
    }

    if (this.pseudoClasses) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.attributes.add(`[${value}]`);

    return this;
  }

  pseudoClass(value) {
    if (this.pseudoClasses === undefined) {
      this.pseudoClasses = new Set();
    }

    if (this.pseudoElems) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.pseudoClasses.add(`:${value}`);

    return this;
  }

  pseudoElement(value) {
    if (this.pseudoElems) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    this.pseudoElems = `::${value}`;

    return this;
  }

  stringify() {
    const el = this.elem ? this.elem : '';
    const id = this.idd ? this.idd : '';

    let classElem = '';

    if (this.classes) {
      const arrClasses = Array.from(this.classes);
      classElem = arrClasses.reduce((str, value) => str + value, '');
    }

    let attribute = '';

    if (this.attributes) {
      const arrAttributes = Array.from(this.attributes);
      attribute = arrAttributes.reduce((str, value) => str + value, '');
    }

    let pseudoClassElem = '';

    if (this.pseudoClasses) {
      const arrPseudoClasses = Array.from(this.pseudoClasses);
      pseudoClassElem = arrPseudoClasses.reduce((str, value) => str + value, '');
    }

    const pseudoElem = this.pseudoElems ? this.pseudoElems : '';

    return `${el}${id}${classElem}${attribute}${pseudoClassElem}${pseudoElem}`;
  }
}

function MyCssSelectorCombine(selector1, combinator, selector2) {
  this.selector1 = selector1;
  this.combinator = combinator;
  this.selector2 = selector2;

  this.stringify = function stringify() {
    return `${this.selector1.stringify()} ${this.combinator} ${this.selector2.stringify()}`;
  };
}

const cssSelectorBuilder = {
  element(value) {
    return new MyCssSelectorBuilder().element(value);
  },

  id(value) {
    return new MyCssSelectorBuilder().id(value);
  },

  class(value) {
    return new MyCssSelectorBuilder().class(value);
  },

  attr(value) {
    return new MyCssSelectorBuilder().attr(value);
  },

  pseudoClass(value) {
    return new MyCssSelectorBuilder().pseudoClass(value);
  },

  pseudoElement(value) {
    return new MyCssSelectorBuilder().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new MyCssSelectorCombine(selector1, combinator, selector2);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
