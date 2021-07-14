import Breadcrumb from './Breadcrumb.js'
import Nodes from './Nodes.js'
import ImageView from './imageView.js'
import Loading from './loading.js'
import {request} from './api.js'

export default class App{
    constructor($app) {

        //default state
        this.state = {
            isRoot: false,
            nodes: [],
            depth: [],
            selectedFilePath: null,
            isLoading: false
        }


        this.breadcrumb = new Breadcrumb({
            $app,
            initialState: this.state.depth
        });

        this.nodes = new Nodes({
            $app,
            initialState: {
                isRoot: this.state.isRoot,
                nodes: this.state.nodes
            },
            onClick: async(node) => {
                try {
                    if (node.type === 'DIRECTORY') {
                        const nextNodes = await request(node.id);
                        this.setState({
                            ...this.state,
                            depth: [...this.state.depth,node],
                            nodes: nextNodes
                        });
                    } else if (node.type === 'FILE') {
                        this.setState({
                            ...this.state,
                            selectedFilePath: node.filePath
                        })
                    }
                } catch (e) {

                }
            },
            onBackClick: async () => {
                try {
                    const nextState = {...this.state};
                    nextState.depth.pop();

                    const prevNodeId = nextState.depth.length === 0 ? null :
                    nextState.depth[nextState.depth.length-1].id;

                    if (prevNodeId === null) {
                        const rootNodes = await request();
                        this.setState({
                            ...nextState,
                            isRoot: true,
                            nodes: rootNodes
                        });
                    } else {
                        const prevNodes = await request(prevNodeId);

                        this.setState({
                            ...nextState,
                            isRoot: false,
                            nodes: prevNodes
                        });
                    }

                } catch(e) {

                }
            }
        });

        this.imageview = new ImageView({
            $app,
            initialState: this.state.selectedFilePath
        });

        this.loading = new Loading({
            $app,
            initialState: this.state.isLoading
        });

        this.initData();
    }

    setState(nextState) {
        this.state = nextState;
        this.breadcrumb.setState(this.state.depth);
        this.nodes.setState({
            isRoot: this.state.isRoot,
            nodes: this.state.nodes
        });
        this.imageview.setState(this.state.selectedFilePath);
        this.loading.setState(this.state.isLoading);
    }

    async initData() {
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
}
