//events (publish subscribe) pattern
(function() {
  $.material.init();
})();


var events = {
  events: {},
  on: function (eventName, fn) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  },
  off: function(eventName, fn) {
    if (this.events[eventName]) {
      for (var i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      };
    }
  },
  emit: function (eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function(fn) {
        fn(data);
      });
    }
  }
};

// Stats module
(function(){
  var people = 0;

  //cache DOM
  var $stats = $('#statsModule');
  var template = $('#stats-template').html();

  //bind events
  events.on('peopleChanged', setPeople);
  _render();

  function _render() {
    $stats.html(Mustache.render(template, {people: people}));
  }

  function setPeople(newPeople) {
    people = newPeople;
    _render();
  }

})();

//people module
(function(){
  var people = [
    {
      name: 'Will',
      age: '23',
      position: 'Line Cook'
    },
    {
      name: 'Steve',
      age: '34',
      position: 'Web Developer'
    }
  ];

  //cache DOM
  var $el = $('#peopleModule');
  var $button = $el.find('button');
  var $nameInput = $el.find('#nameInput');
  var $ageInput = $el.find('#ageInput');
  var $positionInput = $el.find('#positionInput');
  var $ul = $el.find('.people-container');
  var template = $el.find('#people-template').html();

  //bind events
  $button.on('click', addPerson);
  $ul.delegate('i.del', 'click', deletePerson);

  _render();

  function _render() {
    $ul.html(Mustache.render(template, {people: people}));
    events.emit("peopleChanged", people.length);
  }

  function addPerson(value) {

    var newPerson = {
      name: (typeof value === "string") ? value : $nameInput.val(),
      age: (typeof value === "string") ? value : $ageInput.val(),
      position: (typeof value === "string") ? value : $positionInput.val()
    };

    people.push(newPerson);
    _render();
    $nameInput.val('');
    $ageInput.val('');
    $positionInput.val('');
  }

  function deletePerson(event) {
    var i;

    if (typeof event === "number") {
        i = event;
    } else {
        var $remove = $(event.target).closest('.col-sm-4');
        i = $ul.find('.col-sm-4').index($remove);
    }
    people.splice(i, 1);
    _render();
  }


})();
