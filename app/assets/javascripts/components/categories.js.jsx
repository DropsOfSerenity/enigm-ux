var Item = React.createClass({
  handleItemClick: function(e) {
    e.preventDefault();
    this.props.handleItemClick(this.props.item);
  },
  render: function() {
    var boxClasses = "small-box";
    boxClasses += this.props.item.selected ? ' bg-red' : ' bg-aqua'
    return (

      <div className="col-lg-3 col-xs-6">
        <div onClick={this.handleItemClick} style={{cursor: "pointer"}} className={boxClasses}>
          <div className="inner">
            <h3></h3>
            <p>{this.props.item.title}</p>
          </div>
          <div className="icon">
            <i className="fa fa-plus-o"></i>
          </div>
          <a href="#" className="small-box-footer">
            {this.props.item.selected ? 'Remove from estimate.' : 'Add to estimate.'} <i className="fa fa-arrow-circle-right"></i>
          </a>
        </div>
      </div>
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
        <div className="row">
          {items}
        </div>
      </div>
    );
  }
})

var EstimatorItem = React.createClass({
  handleChange: function() {
    var hours = React.findDOMNode(this.refs.hours).value;
    var price = React.findDOMNode(this.refs.price).value;
    this.props.updateItem(this.props.item, hours, price);
  },
  calculateLinePrice: function() {
    var hours = this.props.item.hours || 0;
    var price = this.props.item.price || 0;
    return hours * price;
  },
  render: function() {
    return (
      <div className="row">
        <div className="form-group" style={{margin: "16px 0"}}>
        <div className="col-xs-3">
          <p>{this.props.item.title}</p>
        </div>
        <div className="col-xs-4">
          <input className="form-control" placeholder="Hours" ref="hours" type="text" onChange={this.handleChange} value={this.props.item.hours} />
        </div>
        <div className="col-xs-5">
          <input className="form-control" placeholder="Price per hour" ref="price" type="text" onChange={this.handleChange} value={this.props.item.price} />
        </div>
        </div>
      </div>
    );
  }
});

var Estimator = React.createClass({
  calculateTotalHours: function() {
    var hours = 0;
    _.each(this.props.items, function(item) {
      var h = parseInt(item.hours) || 0;
      hours += h;
    });
    return hours;
  },
  calculateTotalPrice: function() {
    var price = 0;
    _.each(this.props.items, function(item) {
      var h = parseInt(item.hours) || 0;
      var p = item.price || 0;
      price += h * p;
    });
    return price.toFixed(2);
  },
  render: function() {
    var items = this.props.items.map(function(item) {
      return <EstimatorItem updateItem={this.props.updateItem} item={item} key={item.id} />
    }.bind(this));
    return (
      <div>
        <div className="row">
          {items}
        </div>

        <div className="row">
          <h4>Cost Breakdown</h4>
          <div className="info-box">
            <span className="info-box-icon bg-yellow"><i className="fa fa-clock-o"></i></span>
            <div className="info-box-content">
              <span className="info-box-text">Total Hours</span>
              <span className="info-box-number">{this.calculateTotalHours()}</span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="info-box">
            <span className="info-box-icon bg-green"><i className="fa fa-money"></i></span>
            <div className="info-box-content">
              <span className="info-box-text">Total Price</span>
              <span className="info-box-number">${this.calculateTotalPrice()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var Categories = React.createClass({
  updateItem: function(item, hours, price) {
    var state = this.state;
    state.categories.forEach(function(category) {
      category.items.forEach(function(i) {
        if (i.id === item.id) {
          i.hours = hours;
          i.price = price;
        }
      });
    });
    this.setState(state);
  },
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
        <div className="col-lg-9">
          {cats}
        </div>
        <div className="col-lg-3 panel">
          <h2>Full Estimate</h2>
          <Estimator updateItem={this.updateItem} items={this.getSelectedItemList()}/>
        </div>
      </div>
    );
  }
});
