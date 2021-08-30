import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import format from 'node.date-time';

import TxtFieldGroup from './stuff/txtField';
import { queryMeteoEvent } from './actions/queryActions';
import { setMeteoStation } from './actions/meteoAddAction';
import MenuTable from './menuTable';
import TableSensors from './TableSensors';
import TableData from './TableData';

import { Tabs, Tab } from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import MapsPersonPin from 'material-ui/svg-icons/maps/person-pin';
import SensorsIcon from 'material-ui/svg-icons/action/settings-input-component';
import StationsIcon from 'material-ui/svg-icons/action/account-balance';
import DataIcon from 'material-ui/svg-icons/action/timeline';
import IconButton from 'material-ui/IconButton';
import Renew from 'material-ui/svg-icons/action/autorenew';
import Snackbar from '@material-ui/core/Snackbar';
import Slider from '@material-ui/core/Slide';
import SvgIcon from '@material-ui/core/SvgIcon';
import { withStyles } from '@material-ui/core/styles';
import { isNumber } from 'util';


import ReactTable from "react-table";
import checkboxHOC from "react-table/lib/hoc/selectTable";

import FoldableTableHOC from '../foldableTable/index';
import 'react-table/react-table.css';



const CheckboxTable = checkboxHOC(ReactTable);
Object.assign(CheckboxTable, {
    previousText: 'Предыдущие',
    nextText: 'Следующие',
    loadingText: 'Loading...',
    noDataText: 'Записей не найдено',
    pageText: 'Страница',
    ofText: 'из',
    rowsText: 'записей',
});


import shortid from 'shortid';
//import './Table.css';
//import './css/rwd-table.css';

import MeteoData from './MeteoData';

const styles = {
    propContainer: {
        width: '80%',
        overflow: 'hidden',
        margin: '20px auto 0',
    },
    propToggleHeader: {
        margin: '20px auto 10px',
    },
    tableRow: {
        height: '20px'
    },
    tableRowColumn: {
        height: '20px '
    },
    tr: {
        height: '20px '
    }
};




class MeteoForm extends React.Component {
    constructor(props) {
        super(props);
        const {


            fixedHeader,
            fixedFooter,
            stripedRows,
            showRowHover,
            selectable,
            multiSelectable,
            enableSelectAll,
            deselectOnClickaway,
            showCheckboxes,
            height,
            dateTimeBegin,
            dateTimeEnd,
            stationsList,
            sensorsList,
            dataList,
            station_actual,
            auth


        } = props;



        this.state = {
            title: '',
            snack_msg: '',
            errors: {},
            isLoading: false,

            dateTimeBegin,
            dateTimeEnd,
            station_actual,
            sensors_actual: [],
            stationsList,
            sensorsList,
            dataList,
            selected: [],

            fixedHeader,
            fixedFooter,
            stripedRows,
            showRowHover,
            selectable,
            multiSelectable,
            enableSelectAll,
            deselectOnClickaway,
            showCheckboxes,
            height: '300px',

            selection: [],
            selectAll: false,
            isSensor: true,
            auth: auth,
            averaging: 1
        };


        this.onClick = this.onSubmit.bind(this);
        // this.onClose= this.handleClose.bind(this);
        //this.onExited= this.handleClose.bind(this);

        //   this.onRowSelection = this.onRowSelection.bind(this);
    }
    // this.onChange = this.onChange.bind(this);

    // this.handleToggle = this.handleToggle.bind(this);
    //this.handleChange = this.handleChange.bind(this);


    //}
    /// begin of table functions
    setData(data_in) {
        const data = data_in.map(item => {
            const _id = shortid.generate();


            Object.assign(item, { _id: _id });
            return item;
        });
        return data;
    }

    toggleSelection(key, shift, row) {
        /*
          Implementation of how to manage the selection state is up to the developer.
          This implementation uses an array stored in the component state.
          Other implementations could use object keys, a Javascript Set, or Redux... etc.
        */
        // start off with the existing state
        let selection = [...this.state.selection];

        const keyIndex = selection.indexOf(key);
        // check to see if the key exists
        if (keyIndex >= 0) {
            // it does exist so we will remove it using destructing
            selection = [
                ...selection.slice(0, keyIndex),
                ...selection.slice(keyIndex + 1)
            ];
        } else {
            // it does not exist so add it
            selection.push(key);
        }
        // update the state
        this.setState({ selection, station_actual: row.id });
        setMeteoStation(row.id);
    };

    toggleAll() {
        /*
          'toggleAll' is a tricky concept with any filterable table
          do you just select ALL the records that are in your data?
          OR
          do you only select ALL the records that are in the current filtered data?
          
          The latter makes more sense because 'selection' is a visual thing for the user.
          This is especially true if you are going to implement a set of external functions
          that act on the selected information (you would not want to DELETE the wrong thing!).
          
          So, to that end, access to the internals of ReactTable are required to get what is
          currently visible in the table (either on the current page or any other page).
          
          The HOC provides a method call 'getWrappedInstance' to get a ref to the wrapped
          ReactTable and then get the internal state and the 'sortedData'. 
          That can then be iterrated to get all the currently visible records and set
          the selection state.
        */
        const selectAll = this.state.selectAll ? false : true;
        const selection = [];
        if (selectAll) {
            // we need to get at the internals of ReactTable
            const wrappedInstance = this.checkboxTable.getWrappedInstance();
            // the 'sortedData' property contains the currently accessible records based on the filter and sort
            const currentRecords = wrappedInstance.getResolvedState().sortedData;
            // we just push all the IDs onto the selection array
            currentRecords.forEach(item => {
                selection.push(item._original._id);
            });
        }
        this.setState({ selectAll, selection });
    };

    isSelected(key) {
        /*
          Instead of passing our external selection state we provide an 'isSelected'
          callback and detect the selection state ourselves. This allows any implementation
          for selection (either an array, object keys, or even a Javascript Set object).
        */
        return this.state.selection.includes(key);
    };

    //// end of table fuctions

    handleToggle(event, toggled) {
        this.setState({
            [event.target.name]: toggled
        });
    };



   // handleChange(event) {
   //     this.setState({ height: event.target.value });
   // };
   handleChange(name, value) {
    if (isNumber(parseInt(value))) { var val = parseInt(value) } else { var val = value };

    this.setState({ [name]: val });
};

    handleRowSelection(selectedRows) {
        let id_station = (this.state.stationsList[selectedRows].id);

        this.setState({
            selected: selectedRows,
            station_actual: id_station
        });
    };

    //  isSelected(index) {
    //      return this.state.selected.indexOf(index) !== -1;
    //  };
    handleClose() {
        this.setState({ isLoading: false });
    };


    ////////////

    onSubmit(e) {
        e.preventDefault();

        alert('OK');

        //   this.props.createMyEvent(this.state);
    };

    handleClick() {

        // e.preventDefault();
        this.setState({ dateTimeBegin: this.props.dateTimeBegin, dateTimeEnd: this.props.dateTimeEnd });

        this.loadData(1).then(data => {
            if (data) {
                this.setState({ dataList: this.setData(data) })
                this.setState({ isLoading: true })
                this.setState({ snack_msg: 'Данные успешно загружены...' })

            }
            else {
                this.setState({ isLoading: false })
                this.setState({ snack_msg: 'Данные отсутствуют...' })

            }
        });

        //alert('loadData');

        //   this.props.createMyEvent(this.state);
    };

    async    loadData(qtype) {
        let params = {};
        // 0 - all stations, 1- all sensors of the station
        params.period_from = this.props.dateTimeBegin;
        params.period_to = this.props.dateTimeEnd;
        if (qtype === 1) {
            params.station = this.props.station_actual;
            setMeteoStation(this.state.station_actual);
        }

        let data = await (this.props.queryMeteoEvent(params));
        //console.log(data);
        return data;
    };
    //onChange(e) {
    //  this.setState({ [e.target.name]: e.target.value });
    //}
    componentWillMount() {
        //meteofunc
        //const getStations = this.props.queryMeteoEvent(this.state);
        //this.setState({ stationsList: getStations });
        // this.loadData().then(data => this.setState({ stationsList: data }));
        this.loadData(0).then(data => {

            if (this.props.station_actual) {
                let selection = [];
                if (this.props.station_actual.length > 0) {
                    data.forEach(element => {
                        if (element.id == this.props.station_actual) {
                            selection.push(element._id);
                        };
                    });
                    this.setState({ selection });
                    this.setState({ station_actual: this.props.station_actual });
                }
            }

            this.setState({ stationsList: data })
        });
        // this.loadData().then(data => this.setState({ stationsList: data }));


    };
    render() {
        const { toggleSelection, toggleAll, isSelected } = this;
        const { selection, selectAll, stationsList, height } = this.state;
        const { loadData, classes, auth } = this.props;
        // var tableData = this.state.stationsList;
        // const { title, errors, isLoading } = this.state;
        //const {handleChange, handleToggle} = this.props;
        /*let { fixedHeader,
            fixedFooter,
            stripedRows,
            showRowHover,
            selectable,
            multiSelectable,
            enableSelectAll,
            deselectOnClickaway,
            showCheckboxes,
            height
        } = this.props;*/
        const checkboxProps = {
            selection,
            selectAll,
            isSelected: isSelected.bind(this),
            toggleSelection: toggleSelection.bind(this),
            toggleAll: toggleAll.bind(this),
            selectType: "checkbox",
            getTrProps: (s, r) => {
                let selected = false;
                // someone asked for an example of a background color change
                // here it is...
                if (r) {
                    selected = this.isSelected(r.original._id);
                }
                return {
                    style: {
                        backgroundColor: selected ? "lightblue" : "inherit"
                        // color: selected ? 'white' : 'inherit',
                    }
                };
            }
        };

        const Tips = () =>
            <div style={{ textAlign: "center" }}>
                <em>Для сортировки по нескольким полям удерживайте клавишу Shift!</em>
            </div>;

        const Title = [
            {
                Header: "Перечень метеостанций",
                columns: [{
                    Header: "ID станции",
                    id: "id",
                    accessor: d => d.id,
                },
                {
                    Header: "Наименование",
                    id: "namestation",
                    accessor: "namestation",
                    filterable: true,
                },
                {
                    Header: "Период обновления",
                    id: "updateperiod",
                    accessor: "updateperiod"
                },
                {
                    Header: "Последнее обращение",
                    id: "date_time_out",
                    accessor: "date_time_out"
                },
                {
                    Header: "Станция добавлена",
                    id: "date_time_in",
                    accessor: "date_time_in"
                }]
            }
        ]

        return (


            <div>
                <Tabs>
                    <Tab
                    icon={<SvgIcon className={classes.icon}>
                <path d="M17,16H15V22H12V17H8V22H5V16H3L10,10L17,16M6,2L10,6H9V9H7V6H5V9H3V6H2L6,2M18,3L23,8H22V12H19V9H17V12H15.34L14,10.87V8H13L18,3Z"></path> </SvgIcon>}                        label="Метеостанции">
                        <br />
                        <MenuTable handleToggle={this.handleToggle.bind(this)}
                            handleChange={this.handleChange.bind(this)}
                            handleClick={this.handleClick.bind(this)}
                            isStation={true} {...this.state}
                            handleClose={this.handleClose.bind(this)}
                            auth ={auth}
                        />
                        <br />

                        <div >
                            <CheckboxTable
                                ref={r => (this.CheckboxTable = r)}
                                data={stationsList}
                                columns={Title}
                                {...checkboxProps}
                                defaultPageSize={5}
                                className="-striped -highlight"
                                previousText={'Предыдущие'}
                                nextText={'Следующие'}
                                loadingText={'Loading...'}
                                noDataText={'Записей не найдено'}
                                pageText={'Страница'}
                                ofText={'из'}
                                rowsText={'записей'}
                                style={{
                                    height: height // This will force the table body to overflow and scroll, since there is not enough room
                                }}

                                {...this.state}
                            />
                            <br />
                            <Tips />
                        </div>

                    </Tab>
                    <Tab
   icon={<SvgIcon className={classes.icon}>
   <path d="M17.36,20.2V14.82H19.15V22H3V14.82H4.8V20.2H17.36M6.77,14.32L7.14,12.56L15.93,14.41L15.56,16.17L6.77,14.32M7.93,10.11L8.69,8.5L16.83,12.28L16.07,13.9L7.93,10.11M10.19,6.12L11.34,4.74L18.24,10.5L17.09,11.87L10.19,6.12M14.64,1.87L20,9.08L18.56,10.15L13.2,2.94L14.64,1.87M6.59,18.41V16.61H15.57V18.41H6.59Z"></path> </SvgIcon>}                        label="Данные наблюдений"
                    >

                        <MeteoData
                            {...this.state}
                            loadData={loadData}
                        />

                    </Tab>


                </Tabs>
                


            </div >
        );
    }
}

function mapStateToProps(state) {
    return {

        /*  fixedHeader: state.fixedHeader,
          fixedFooter: state.fixedFooter,
          stripedRows: state.stripedRows,
          showRowHover: state.showRowHover,
          selectable: state.selectable,
          multiSelectable: state.multiSelectable,
          enableSelectAll: state.enableSelectAll,
          deselectOnClickaway: state.deselectOnClickaway,
          showCheckboxes: state.showCheckboxes,*/
        // sensorsList: state.sensorsList,
        dateTimeBegin: state.datePickers.dateTimeBegin,
        dateTimeEnd: state.datePickers.dateTimeEnd,
        station_actual: state.meteoStation


    };
}


MeteoForm.propTypes = {
    queryMeteoEvent: PropTypes.func.isRequired,
    //loadData: PropTypes.func.isRequired
}

MeteoForm.contextType = {
    router: PropTypes.object.isRequired
}

export default connect(mapStateToProps, { queryMeteoEvent })(withRouter(withStyles(styles)(MeteoForm)));