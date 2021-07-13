import Breadcrumb from './Breadcrumb.js'
import Nodes from './Nodes.js'
import ImageView from './imageView.js'
import {request} from './api.js'

export default class App{
    constructor($app) {

        //default state
        this.state = {
            isRoot: false,
            nodes: [],
            depth: []
        }

        const initData = async() => {
            try {
                const rootNodes = await request();
                this.setState({
                    ...this.state,
                    isRoot: true,
                    nodes: rootNodes
                });
            } catch(e) {
            }
        }

        initData();

        const breadcrumb = new Breadcrumb({
            $app,
            initialState: this.state.depth
        });

        const nodes = new Nodes({
            $app,
            initialState: {
                isRoot: this.state.isRoot,
                nodes: this.state.nodes
            },
            onClick: async(node) => {
                try {
                    console.log("afd");
                    if (node.type === 'DIRECTORY') {
                        const nextNodes = await request(node.id);
                        this.setState({
                            ...this.state,
                            depth: [...this.state.depth,node],
                            nodes: nextNodes
                        });
                    } else if (node.type === 'FILE') {

                    }
                } catch (e) {

                }
            }
        });


    }

    setState(nextState) {
        this.state = nextState;
        breadcrumb.setState(this.state.depth);
        nodes.setState({
            isRoot: this.state.isRoot,
            nodes: this.state.nodes
        })

    }
}
