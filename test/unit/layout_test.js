function isDisplayed(element) {
  var originalElement = element;
  
  while (element && element.parentNode) {
    var display = element.getStyle('display');
    if (display === 'none') {
      return false;
    }
    element = $(element.parentNode);
  }    
  return true;
}

new Test.Unit.Runner({
  setup: function() {
  },
  'test preCompute argument of layout': function() {
    var preComputedLayout = $('box1').getLayout(true),
        normalLayout = $('box1').getLayout();
    
    // restore normal get method from Hash object
    preComputedLayout.get = Hash.prototype.get;
    
    Element.Layout.PROPERTIES.each(function(key) {
      this.assertEqual(normalLayout.get(key), preComputedLayout.get(key), key);
    }, this);
  },
  
  'test layout on absolutely-positioned elements': function() {
    var layout = $('box1').getLayout();
    
    this.assertEqual(242, layout.get('width'),  'width' );
    this.assertEqual(555, layout.get('height'), 'height');
    
    this.assertEqual(3, layout.get('border-left'), 'border-left');    
    this.assertEqual(10, layout.get('padding-top'), 'padding-top');
    this.assertEqual(1020, layout.get('top'), 'top');
    
    this.assertEqual(25, layout.get('left'), 'left');  
  },
  
  'test toObject method': function(){
    var layout = $('box1').getLayout();
    
    // default behavior
    var object      = layout.toObject(),
        fullObject  = Element.Layout.PROPERTIES.inject({}, function(obj, key){
      obj[key] = layout.get(key);
      return obj;
    });
    
    this.assertEnumEqual(Object.keys(object), Element.Layout.PROPERTIES);
    this.assertEnumEqual(Object.values(object), Object.values(fullObject));
    
    // with given keys as string
    object = layout.toObject('width height top left');
    
    this.assertEnumEqual(Object.keys(object), ['width', 'height', 'top', 'left']);
    this.assertEnumEqual(Object.values(object), [242, 555, 1020, 25]);
    
    // with given keys as array of strings
    object = layout.toObject('width height', 'top', 'left');

    this.assertEnumEqual(Object.keys(object), ['width', 'height', 'top', 'left']);
    this.assertEnumEqual(Object.values(object), [242, 555, 1020, 25]);
  },
  
  'test layout on elements with display: none and exact width': function() {
    var layout = $('box2').getLayout();
    
    this.assert(!isDisplayed($('box3')), 'box should be hidden');

    this.assertEqual(500, layout.get('width'), 'width');
    this.assertEqual(3, layout.get('border-right'), 'border-right');
    this.assertEqual(10, layout.get('padding-bottom'), 'padding-bottom');

    this.assert(!isDisplayed($('box3')), 'box should still be hidden');
  },
  
  'test layout on elements with display: none and width: auto': function() {
    var layout = $('box3').getLayout();
    
    this.assert(!isDisplayed($('box3')), 'box should be hidden');
    
    this.assertEqual(364, layout.get('width'), 'width');
    this.assertEqual(400, layout.get('margin-box-width'), 'margin-box-width');
    this.assertEqual(3, layout.get('border-right'), 'border-top');
    this.assertEqual(10, layout.get('padding-bottom'), 'padding-right');

    // Ensure that we cleaned up after ourselves.
    this.assert(!isDisplayed($('box3')), 'box should still be hidden');
  },
  
  'test layout on elements with display: none ancestors': function() {
    var layout = $('box4').getLayout();
    
    this.assert(!isDisplayed($('box4')), 'box should be hidden');
    
    // Width and height values are nonsensical for deeply-hidden elements.
    this.assertEqual(0, layout.get('width'), 'width of a deeply-hidden element should be 0');
    this.assertEqual(0, layout.get('margin-box-height'), 'height of a deeply-hidden element should be 0');
    
    // But we can still get meaningful values for other measurements.
    this.assertEqual(0, layout.get('border-right'), 'border-top');
    this.assertEqual(13, layout.get('padding-bottom'), 'padding-right');
    
    // Ensure that we cleaned up after ourselves.
    this.assert(!isDisplayed($('box3')), 'box should still be hidden');
  },
  
  'test positioning on absolutely-positioned elements': function() {
    var layout = $('box5').getLayout();
    
    this.assertEqual(30, layout.get('top'), 'top');
    this.assertEqual(60, layout.get('right'), 'right (percentage value)');
    
    this.assertEqual(340, layout.get('left'), 'left');
  },
  
  'test positioning on absolutely-positioned element with top=0 and left=0': function() {
    var layout = $('box6').getLayout();
    
    this.assertEqual(0, layout.get('top'), 'top');
    this.assertIdentical($('box6_parent'), $('box6').getOffsetParent());
  }
});