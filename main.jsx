var Page = React.createClass({
    render: function() {
        return (<h1>New page</h1>);
    }
});

ReactDOM.render(
    <Page data={data} />,
    document.getElementById('content')
);