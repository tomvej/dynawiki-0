var Section = React.createClass({
    contents: function() {
        return this.props.data.contents.map(function(elem) {
            switch (elem.type) {
                case "editor":
                    return <Editor key="editor" data={elem}/>;
                case "paragraph":
                    return <Paragraph key={elem.id} data={elem}/>;
                case "section":
                    return <Section key={elem.id} data={elem}/>;
            }
        });
    },
    render: function() {
        return (
            <section>
                <Header title={this.props.data.heading}/>
                {this.contents()}
            </section>
        );
    }
});

var Header = React.createClass({
    render: function() {
        return (
            <header><h1>New Page</h1></header>
        );
    }
});

var Editor = React.createClass({
    render: function() {
        return <textarea></textarea>;
    }
});

var Paragraph = React.createClass({
    render: function() {
        return (<p></p>);
    }
});

ReactDOM.render(
    <Section data={data} />,
    document.getElementById('content')
);