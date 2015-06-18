var Item = React.createClass({
  handleItemClick: function(e) {
    this.props.handleItemClick(this.props.item);
  },
  render: function() {
    return (
      <li onClick={this.handleItemClick}>
        {this.props.item.selected ? 'selected' : 'notselected'} -- {this.props.item.title}
      </li>
    );
  }
});

var Category = React.createClass({
  handleItemClick: function(item) {
    this.props.handleItemClick(item);
  },
  render: function() {
    var items = this.props.category.items.map(function(item) {
      return (
        <Item item={item} handleItemClick={this.handleItemClick} key={item.id} />
      );
    }.bind(this));
    return (
      <div>
        <h1>{this.props.category.title}</h1>
        <ul>
          {items}
        </ul>
      </div>
    );
  }
})

var EstimatorItem = React.createClass({
  handleBlur: function() {
  },
  calculateLinePrice: function() {
    var hours = this.props.item.hours || 0;
    var price = this.props.item.price || 0;
    return hours * price;
  },
  render: function() {
    return (
      <div>
        {this.props.item.title}
        <label>Hours
          <input ref="hours" type="text" onBlur={this.handleBlur} value={this.props.item.hours} />
        </label>
        <label>Price Per Hour
          <input ref="price" type="text" onBlur={this.handleBlur} value={this.props.item.price} />
        </label>
        <label>Total</label>
        <div>Price: {this.calculateLinePrice()}</div>
      </div>
    );
  }
});

var Estimator = React.createClass({
  render: function() {
    var items = this.props.items.map(function(item) {
      return <EstimatorItem item={item} key={item.id} />
    }.bind(this));
    return (
      <div>{items}</div>
    );
  }
});

var Categories = React.createClass({
  getSelectedItemList: function() {
    var items = _.chain(this.state.categories)
      .pluck('items')
      .flatten()
      .filter(function(item) {
        return !!item.selected;
      })
      .value()
    return items;
  },
  handleItemClick: function(item) {
    var state = this.state;
    state.categories.forEach(function(category) {
      category.items.forEach(function(i) {
        if (i.id === item.id) {
          i.selected = !i.selected;
        }
      });
    });
    this.setState(state);
  },
  getInitialState: function() {
    return {
      categories: this.props.categories
    };
  },
  render: function() {
    var cats = this.state.categories.map(function(category) {
      return (
        <Category category={category} handleItemClick={this.handleItemClick} key={category.id} />
      );
    }.bind(this));
    return (
      <div>
        {cats}
        <div>
          <Estimator items={this.getSelectedItemList()}/>
        </div>
      </div>
    );
  }
});
