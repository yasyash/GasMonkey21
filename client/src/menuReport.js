import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconMenu from 'material-ui/IconMenu';

import Snackbar from '@material-ui/core/Snackbar';
import Slider from '@material-ui/core/Slide';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';


import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

import SvgIcon from '@material-ui/core/SvgIcon';

import WbCloudy from '@material-ui/icons/WbCloudy'
import BarChart from '@material-ui/icons/Equalizer';
import TimeLine from '@material-ui/icons/Timeline';
import Switch from '@material-ui/core/Switch';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import Tooltip from '@material-ui/core/Tooltip';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

import CheckBox from '@material-ui/icons/CheckBox';
import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';

import TextField from '@material-ui/core/TextField';


import { connect } from 'react-redux';

import isEmpty from 'lodash.isempty';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
//import htmlDocx from 'html-docx-js/dist/html-docx';
//import htmlTo from 'html2xlsx';
import { saveAs } from 'file-saver'
//import * as fs from 'level-filesystem';
import canvas2pdf from 'canvas2pdf/src/canvas2pdf';

import { dateAddReportAction } from './actions/dateAddAction';
import { toUpper } from 'ramda';



const ITEM_HEIGHT = 48;

//window.html2canvas = html2canvas;

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexWrap: 'wrap'
    },
    formControl: {
        margin: 2,
        minWidth: 160,
        padding: 0
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    icon: {
        margin: theme.spacing.unit * 2,
        color: blue[600],
        width: 30,
        height: 30,
        margin: 0
    },
    iOSSwitchBase: {
        '&$iOSChecked': {
            color: theme.palette.common.white,
            '& + $iOSBar': {
                backgroundColor: blue[600],
            },
        },
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
            easing: theme.transitions.easing.sharp,
        }),
    },
    iOSChecked: {
        transform: 'translateX(15px)',
        '& + $iOSBar': {
            opacity: 1,
            border: 'none',
        },
    },
    iOSBar: {
        borderRadius: 13,
        width: 42,
        height: 26,
        marginTop: -13,
        marginLeft: -21,
        border: 'solid 1px',
        borderColor: theme.palette.grey[400],
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    iOSIcon: {
        width: 24,
        height: 24,
    },
    iOSIconChecked: {
        boxShadow: theme.shadows[1],
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 150,
    }, textFieldWide: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 180,
    },
    textFieldWidest: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 210,
    },
    _td: { textAlign: 'center' },

    alert_macs1_ylw: {
        backgroundColor: '#ffff1a'
    },
    alert_macs5_orng: {
        backgroundColor: '#ff4d00'
    },

    alert_macs10_red: {
        backgroundColor: '#ff0000'
    },
    alert_success: {
        color: '#000000',
        backgroundColor: '#ffffff'
    },
    button: {
        margin: 0,
    },
    input: {
        display: 'none',
    },
    alert_range: {
        backgroundColor: '#ffa500'
    },
    alert_empty: {
        backgroundColor: '#a5a5cc'
    }
});

function fnExcelReport() {
    var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
    tab_text = tab_text + '<head><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';

    tab_text = tab_text + '<x:Name>Test Sheet</x:Name>';

    tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
    tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';

    tab_text = tab_text + "<table border='1px'>";
    tab_text = tab_text + $('#myTable').html();
    tab_text = tab_text + '</table></body></html>';

    var data_type = 'data:application/vnd.ms-excel';

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        if (window.navigator.msSaveBlob) {
            var blob = new Blob([tab_text], {
                type: "application/csv;charset=utf-8;"
            });
            navigator.msSaveBlob(blob, 'Test file.xls');
        }
    } else {
        $('#test').attr('href', data_type + ', ' + encodeURIComponent(tab_text));
        $('#test').attr('download', 'Test file.xls');
    }

};


class MenuReport extends Component {

    constructor(props) {
        let isNll = false;
        super(props);

        const { fixedHeader,

            isStation,
            isLoading,
            snack_msg,
            value,
            options,
            meteoOptions,
            dateReportBegin,
            dateReportEnd,
            station_actual,
            stationsList,
            sensorsList,
            dataList,
            selected: [],
            sensors_actual,
            station_name,
            report_type,
            data_4_report,
            autoHideDuration
        } = props;

        if (isStation) { isNll = true }

        this.state = {

            isStation: isNll,
            isLoading,
            snack_msg,
            value,
            anchorEl: null,
            options,
            meteoOptions,
            checked: [],

            dateReportBegin,
            dateReportEnd,
            station_actual,
            stationsList,
            sensorsList,
            dataList,
            selected: [],
            sensors_actual,
            station_name,
            report_type,
            data_4_report,
            chemical_list: ['NO', 'NO2', 'NH3', 'SO2', 'H2S', 'O3', 'CO', 'CH2O', 'PM1', 'PM2.5', 'PM10', '???????? ??????????',
                '????????????', '????????????', '????????????????????', '??,??-????????????', '??-????????????', '????????????????????', '????????????', '??????????', '??????. ????????????????', '????????. ??????????????',
                '???????????????? ??????????', '?????????????????? ????????.', '?????????????????????? ??????????', '????????????. ??????????????'],
            chemical: '',
            autoHideDuration: isEmpty(autoHideDuration) ? 3000 : autoHideDuration
        };




        //this.handleClose = this.handleClose.bind (this);
        //this.handleClick = this.handleClick.bind (this);
        // this.handleChange = this.handleChange.bind (this);
        this.handleChangeCheck = this.handleChangeCheck.bind(this)

    }

    translit = (_in) => {

        var transl = new Array();
        transl['??'] = 'A'; transl['??'] = 'a';
        transl['??'] = 'B'; transl['??'] = 'b';
        transl['??'] = 'V'; transl['??'] = 'v';
        transl['??'] = 'G'; transl['??'] = 'g';
        transl['??'] = 'D'; transl['??'] = 'd';
        transl['??'] = 'E'; transl['??'] = 'e';
        transl['??'] = 'Yo'; transl['??'] = 'yo';
        transl['??'] = 'Zh'; transl['??'] = 'zh';
        transl['??'] = 'Z'; transl['??'] = 'z';
        transl['??'] = 'I'; transl['??'] = 'i';
        transl['??'] = 'J'; transl['??'] = 'j';
        transl['??'] = 'K'; transl['??'] = 'k';
        transl['??'] = 'L'; transl['??'] = 'l';
        transl['??'] = 'M'; transl['??'] = 'm';
        transl['??'] = 'N'; transl['??'] = 'n';
        transl['??'] = 'O'; transl['??'] = 'o';
        transl['??'] = 'P'; transl['??'] = 'p';
        transl['??'] = 'R'; transl['??'] = 'r';
        transl['??'] = 'S'; transl['??'] = 's';
        transl['??'] = 'T'; transl['??'] = 't';
        transl['??'] = 'U'; transl['??'] = 'u';
        transl['??'] = 'F'; transl['??'] = 'f';
        transl['??'] = 'X'; transl['??'] = 'x';
        transl['??'] = 'C'; transl['??'] = 'c';
        transl['??'] = 'Ch'; transl['??'] = 'ch';
        transl['??'] = 'Sh'; transl['??'] = 'sh';
        transl['??'] = 'Sch'; transl['??'] = 'sch';
        transl['??'] = ''; transl['??'] = '';
        transl['??'] = 'Y'; transl['??'] = 'y';
        transl['??'] = ''; transl['??'] = '';
        transl['??'] = 'E'; transl['??'] = 'e';
        transl['??'] = 'Yu'; transl['??'] = 'yu';
        transl['??'] = 'Ya'; transl['??'] = 'ya';
        transl['???'] = 'No';

        var out = '';

        for (var i = 0; i < _in.length; i++) {
            if (transl[_in[i]] != undefined) { out += transl[_in[i]]; }
            else { out += _in[i]; }
        }
        if (isEmpty(out)) {
            return _in;
        }
        else {
            return out;
        }

    };

    daysInMonth = (month) => {
        let days = 33 - new Date(new Date().getFullYear(), month, 33).getDate();
        return days;

    };

    handleLocalChangeToggle = name => event => {
        // const{meteoOptions} = this.props;
        // const{options} = this.props;

        this.props.handleChangeToggle(name, event);
        // this.setState({meteoOptions});
        // this.setState({options});

    };

    async createPDF(html) {
        let options = {
            html: html,
            fileName: 'test',
            directory: '/home/ilit/weather/test',
        };

        // let file = await RNHTMLtoPDF.convert(options)
        console.log(file.filePath);
    };
    handleClick = (name) => {

        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        })

        if (this.props.report_type == 'operative') {
            var _html = document.getElementById('operative_report');
            var dom = document.createElement('operative_report');
        };

        if (this.props.report_type == 'daily') {
            var _html = document.getElementById('daily_report');
            var dom = document.createElement('daily_report');
        };

        if (this.props.report_type == 'monthly') {
            var _html = document.getElementById('monthly_report');
            var dom = document.createElement('monthly_report');
        };

        if ((this.props.report_type == 'tza4') || (this.props.report_type == 'tza4_auto')) {
            var _html = document.getElementById('tza4_report');
            var dom = document.createElement('tza4_report');
        };
        dom.operative_report = _html;
        let pdfHTML = _html.childNodes[0];
        let canvas = doc.canvas;
        canvas.height = 210;
        canvas.width = 290;
        canvas.style = { width: 290, height: 210 };

        const { dateReportEnd } = this.state;
        //canvas.pdf = doc;

        html2canvas(_html).then(function (_canvas) {
            //document.body.appendChild(_canvas);
            //doc.setPage(0);
            //doc.canvas=_canvas;

            // var iframe = document.createElement('iframe');
            //iframe.setAttribute('style','position:absolute;right:0; top:0; bottom:0; height:100%; width:500px');
            //document.body.appendChild(iframe);
            //iframe.src = _canvas;
            //  doc.output('save', 'OperativeReport_'+new Date(dateReportEnd).format('dd-MM-Y_H:mm')+'.pdf');
            //doc.save('OperativeReport_'+new Date(dateReportEnd).format('dd-MM-Y_H:mm')+'.pdf');


            ////// _canvas.toBlob((blob)=>{
            //////     saveAs(blob, 'OperativeReport_'+new Date(dateReportEnd).format('dd-MM-Y_H:mm')+'.png');
            ///// });

            /* var stream = blobStream();
              var ctx = canvas2pdf.PdfContext(stream);
             ctx.stream.on('finish', function () {
                  var blob = ctx.stream.toBlob('application/pdf');
                  saveAs(blob, 'OperativeReport_'+new Date(dateReportEnd).format('dd-MM-Y_H:mm')+'.pdf', true);
              });
          ctx.end();*/


        });
        var opt = {
            margin: 15,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 5 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };
        if (this.props.report_type == 'operative')
            var worker = html2pdf().from(_html.innerHTML).set(opt).save('OperativeReport_Station_' + this.props.station_name + '_' + new Date(dateReportEnd).format('dd-MM-Y_H:mm') + '.pdf');

        if (this.props.report_type == 'daily')
            var worker = html2pdf().from(_html.innerHTML).set(opt).save('DailyReport_Station_' + this.props.station_name + '_' + new Date(dateReportEnd).format('dd-MM-Y') + '.pdf');

        if (this.props.report_type == 'monthly')
            var worker = html2pdf().from(_html.innerHTML).set(opt).save('MonthlyReport_Station_' + this.props.station_name + '_' + new Date(dateReportEnd).format('MM-Y') + '.pdf');

        if (this.props.report_type == 'tza4')
            var worker = html2pdf().from(_html.innerHTML).set(opt).save('TZA4_Report_Station_' + this.props.station_name + '_Substance_' + this.state.chemical + '_' + new Date(dateReportEnd).format('MM-Y') + '.pdf');


        /*doc.fromHTML(pdfHTML,1,1,null,(obj)=>{
            var iframe = document.createElement('iframe');
            iframe.setAttribute('style','position:absolute;right:0; top:0; bottom:0; height:100%; width:500px');
            document.body.appendChild(iframe);
            iframe.src = doc.output ('datauristring');
            doc.output('save', 'OperativeReport_'+new Date(dateReportEnd).format('dd-MM-Y_H:mm')+'.pdf');
            //doc.save('OperativeReport_'+new Date(this.state.dateReportEnd).format('dd-MM-Y_H:mm')+'.pdf');
        });*/
        //html2pdf(pdfHTML[0], doc, (obj) =>{
        //doc.fromHTML(pdfHTML);      
        //   doc.save('OperativeReport_'+new Date(this.state.dateReportEnd).format('dd-MM-Y_H:mm')+'.pdf');
        //});

        /*html2pdf(_html.innerHTML,doc,(doc)=>{
            var iframe = document.createElement('iframe');
            iframe.setAttribute('style','position:absolute;right:0; top:0; bottom:0; height:100%; width:500px');
            document.body.appendChild(iframe);
            iframe.src = doc.output ('datauristring');
            doc.output('save', 'OperativeReport_'+new Date(dateReportEnd).format('dd-MM-Y_H:mm')+'.pdf');
            //doc.save('OperativeReport_'+new Date(this.state.dateReportEnd).format('dd-MM-Y_H:mm')+'.pdf');
        });*/

        /*doc.addHTML (document.body).then((canvas)=>{
            doc.canvas = canvas;
         //this.createPDF(doc.innerHTML);
         doc.save('OperativeReport_'+new Date(this.state.dateReportEnd).format('dd-MM-Y_H:mm')+'.pdf');
        });*/


        //html2canvas(dom).then((canv) =>{

        //  doc.save('OperativeReport_'+new Date(this.state.dateReportEnd).format('dd-MM-Y_H:mm')+'.pdf');});

        // doc.addHTML (_html).then((canvas)=>{
        //   doc.canvas = canvas;


    }


    async wrapReportGen(params) {
        var response = await (this.props.reportGen({ report: 'operative', html: _html.innerHTML }));
        return response;
    }

    handleWordClick = (name) => {
        const _html = document.getElementById('operative_report');
        const text = "12345465465";
        const { dateReportEnd } = this.props;
        var date = '';
        var chemical = this.state.chemical;

        if (this.props.report_type == 'operative')
            date = new Date(dateReportEnd).format('dd-MM-Y_H:mm');

        if (this.props.report_type == 'daily')
            date = new Date(dateReportEnd).format('dd-MM-Y');

        if (this.props.report_type == 'monthly')
            date = new Date(dateReportEnd).format('MM-Y');

        if (this.props.report_type == 'tza4')
            date = new Date(dateReportEnd).format('MM-Y');

        if (this.props.report_type == 'tza4_auto')
            date = new Date(dateReportEnd).format('MM-Y');

        if (!isEmpty(this.props.data_4_report)) {

            let { data_4_report } = this.props;

            data_4_report[0].station = this.translit(data_4_report[0].station);

            this.props.reportGen({ report: this.props.report_type, station: this.translit(this.props.station_name), date: date, data_4_report: data_4_report, chemical: this.translit(chemical), checked_meteo: this.props.checked_meteo }).then(response => {
                //var xhr = new XMLHttpRequest();

                var type = response.headers['content-type'];
                var filename = "";
                var disposition = response.headers['content-disposition'];

                if (disposition && disposition.indexOf('attachment') !== -1) {
                    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    var matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                }
                //var blob = new File([response], filename, { type: type });
                var blob = new Blob([response.data], { type: type });

                saveAs(blob, filename);


                // var byteNumbers = new Uint8Array(response.length);

                //for (var i = 0; i < response.length; i++) {

                //   byteNumbers[i] = response.charCodeAt(i);

                //  }
                //  var blob = new Blob([byteNumbers], {type: 'text/html'});
                // saveAs(response, 'OperativeReport_'+new Date(dateReportEnd).format('dd-MM-Y_H:mm')+'.docx', false);
            });
        }
    };

    handleExcelClick = (name) => {

        const { dateReportEnd } = this.props;
        var date = '';
        var chemical = this.state.chemical;

        if (this.props.report_type == 'operative')
            date = new Date(dateReportEnd).format('dd-MM-Y_H:mm');

        if (this.props.report_type == 'daily')
            date = new Date(dateReportEnd).format('dd-MM-Y');

        if (this.props.report_type == 'monthly')
            date = new Date(dateReportEnd).format('MM-Y');

        if (this.props.report_type == 'tza4')
            date = new Date(dateReportEnd).format('MM-Y');

        if (this.props.report_type == 'tza4_auto')
            date = new Date(dateReportEnd).format('MM-Y')

        if (!isEmpty(this.props.data_4_report)) {

            let { data_4_report } = this.props;

            data_4_report[0].station = this.translit(data_4_report[0].station);

            if ((this.props.report_type != 'csv')) {

                this.props.reportXlsGen({ report: this.props.report_type, station: this.translit(this.props.station_name), date: date, data_4_report: data_4_report, chemical: this.translit(chemical), checked_meteo: this.props.checked_meteo }).then(response => {
                    //var xhr = new XMLHttpRequest();

                    var type = response.headers['content-type'];
                    var filename = "";
                    var disposition = response.headers['content-disposition'];

                    if (disposition && disposition.indexOf('attachment') !== -1) {
                        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                        var matches = filenameRegex.exec(disposition);
                        if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                    }
                    //var blob = new File([response], filename, { type: type });
                    var blob = new Blob([response.data], { type: type });

                    saveAs(blob, filename);

                });

            }

            else {
                // console.log("TZA")
                if (this.props.report_type == 'tza4') {
                    var filename = this.props.report_type + '_report_station_' + this.translit(this.props.station_name) + '_substance_' + this.translit(chemical) + '_' + date + '.csv';//TZA_4_Report_station_PNZ 1_Substance_CO_03-2020.xlsx"
                    var data = this.props.data_4_report;
                    var pollution = data[0].values[0].pollution;

                    var str_hdr = ';;;;;;;;;;;;;;;;??????????????;????????-4??;;;;;;;;;;;;;;;;\r\n';

                    str_hdr += ';;;;;;;;;;;;;;;;;;;;;;;;;;?????? ' + data[0].values[0].year + '; ?????????? ;' + data[0].values[0].month + ';;;;;\r\n';
                    str_hdr += 'D;P;01 ??????;02  ??????;03  ??????;04  ??????;05  ??????;06  ??????;07  ??????;08  ??????;09  ??????;10  ??????;11  ??????;12  ??????;13  ??????;14  ??????;15  ??????;16  ??????;17  ??????;18  ??????;19  ??????;20  ??????;21  ??????;22  ??????;23  ??????;24  ??????;Sum Qc;n;Qc;Qm;T Qm;Tq\r\n';

                    var str_body = '';
                    var legend = ['D ??? ????????, P ??? ?????????????? ??????????????????????????,'];
                    legend.push('SumQc ??? ?????????? ???????????????????????? ???? ??????????,');
                    legend.push('n ??? ?????????? ?????????????? ???? ??????????,');
                    legend.push('Qc ??? ?????????????? ???????????????????????? ???? ??????????,');
                    legend.push(' Qm ??? ???????????????????????? ???????????????????????? ???? ??????????,');
                    legend.push('TQm ??? ?????????? ?????????????????????? ???????????????????????? ???????????????????????? ???? ??????????,');
                    legend.push(' Tq ??? ?????????????????????????????????? ?????????????? ?????? Q > ??????,');
                    legend.push('?? ??? ?????????? ?????????????? ???? ?????????? (SumQc, n, Qc),');
                    legend.push('Max Qc ??? ???????????????????????? ???????????????????????????? ???????????????????????? ???? ??????????,');
                    legend.push('TmaxQc ??? ???????? ???????????????????? MaxQc,');
                    legend.push('SumDcc ??? ???????????????????? ???????? ?? Q?? > ??????????.');
                    var i = 0;
                    if (!this.props.checked_meteo) {
                        pollution.forEach(item => {

                            str_body += item.time + ';' + item.P + ';' + item.h1 + ';' + item.h2 + ';' + item.h3 + ';' + item.h4 +
                                ';' + item.h5 + ';' + item.h6 + ';' + item.h7 + ';' + item.h8 + ';' + item.h9 + ';' + item.h10 + ';' + item.h11 +
                                ';' + item.h12 + ';' + item.h13 + ';' + item.h14 + ';' + item.h15 + ';' + item.h16 + ';' + item.h17 + ';' + item.h18 +
                                ';' + item.h19 + ';' + item.h20 + ';' + item.h21 + ';' + item.h22 + ';' + item.h23 + ';' + item.h24 + ';' + item.SumQc +
                                ';' + item.n + ';' + item.Qc + ';' + item.Qm + ';' + item.Tm + ';' + item.Tq;

                            if (i < legend.length)
                                str_body += ';' + legend[i];

                            i++;

                            str_body += '\r\n';
                        });
                    } else {
                        pollution.forEach(item => {

                            str_body += item.time + ';' + item.P + ';' + item.h1 + ';' + item.h2 + ';' + item.h3 + ';' + item.h4 +
                                ';' + item.h5 + ';' + item.h6 + ';' + item.h7 + ';' + item.h8 + ';' + item.h9 + ';' + item.h10 + ';' + item.h11 +
                                ';' + item.h12 + ';' + item.h13 + ';' + item.h14 + ';' + item.h15 + ';' + item.h16 + ';' + item.h17 + ';' + item.h18 +
                                ';' + item.h19 + ';' + item.h20 + ';' + item.h21 + ';' + item.h22 + ';' + item.h23 + ';' + item.h24 + ';' + item.SumQc +
                                ';' + item.n + ';' + item.Qc + ';' + item.Qm + ';' + item.Tm + ';' + item.Tq;
                            str_body += '\r\n';
                            let _tmp = [];
                            item.Temp.forEach(_item => {

                                _tmp.push(String(_item).replace('.', ','));
                            });
                            item.Temp = _tmp;
                            _tmp = [];
                            item.Hum.forEach(_item => {

                                _tmp.push(String(_item).replace('.', ','));
                            });
                            item.Hum = _tmp;
                            _tmp = [];
                            item.Spd.forEach(_item => {

                                _tmp.push(String(_item).replace('.', ','));
                            });
                            item.Spd = _tmp;
                            _tmp = [];
                            item.Dir.forEach(_item => {

                                _tmp.push(String(_item).replace('.', ','));
                            });
                            item.Dir = _tmp;

                            str_body += '????????., ??;;' + item.Temp.join(';');
                            str_body += '\r\n';
                            str_body += '??????????., %;;' + item.Hum.join(';');
                            str_body += '\r\n';
                            str_body += '????????. ??????????, ????????.;;' + item.Spd.join(';');
                            str_body += '\r\n';
                            str_body += '????????. ??????????, ??/??;;' + item.Dir.join(';');

                            if (i < legend.length)
                                str_body += ';' + legend[i];

                            i++;

                            str_body += '\r\n';
                        });

                    }
                    str_body += ';;;;;;;;;;;;;;;;;;;;;;;;;M;' + data[0].values[0].M_SumQc + ';' + data[0].values[0].M_n + ';' + data[0].values[0].M_Qc + '\r\n';
                    str_body += ';;;;;;;;;;;;;;;;;;;;;;;;;Max Qc;' + data[0].values[0].Max_Qc + ';;;\r\n';
                    str_body += ';;;;;;;;;;;;;;;;;;;;;;;;;Tmax Qc;' + data[0].values[0].Tmax_Qc + ';;;\r\n';
                    str_body += ';;;;;;;;;;;;;;;;;;;;;;;;;Sum Dcc;' + data[0].values[0].Sum_Dcc + ';;;\r\n';
                    //'D ??? ????????, P ??? ?????????????? ??????????????????????????, SumQc ??? ?????????? ???????????????????????? ???? ??????????, n ??? ?????????? ?????????????? ???? ??????????, Qc ??? ?????????????? ???????????????????????? ???? ??????????, Qm ??? ???????????????????????? ???????????????????????? ???? ??????????, TQm ??? ?????????? ?????????????????????? ???????????????????????? ???????????????????????? ???? ??????????, Tq ??? ?????????????????????????????????? ?????????????? ?????? Q > ??????, ?? ??? ?????????? ?????????????? ???? ?????????? (SumQc, n, Qc), Max Qc ??? ???????????????????????? ???????????????????????????? ???????????????????????? ???? ??????????, TmaxQc ??? ???????? ???????????????????? MaxQc, SumDcc ??? ???????????????????? ???????? ?? Q?? > ??????????.';


                    var file = [str_hdr + '\r\n' + str_body];

                    var blob = new Blob([file], { type: "text/plain;charset=utf-8" });

                    saveAs(blob, filename);
                } else {
                    var filename = toUpper(this.props.report_type) + '_2015_' + '_report_station_' + this.translit(this.props.station_name) + '_' + date + '.csv';//TZA_4_Report_station_PNZ 1_Substance_CO_03-2020.xlsx"
                    var data = this.props.data_4_report;
                    var pollution = data[0].values[0].pollution;

                    var str_hdr = ';;;;;;;;;;;??????????????;????????-4??;;;;;;;;;;;;;;;;;;;;;\r\n';
                    str_hdr += ';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\r\n';
                    str_hdr += ';;;????????;;;;;;;;;;;?????? ' + data[0].values[0].year + '; ?????????? ;' + data[0].values[0].month + ';;;;;;;;;;;;;;;;;\r\n';
                    str_hdr += ';;;' + data[0].station + ';;???????????????????? ;??????????;;;;;;;;????????????: ;' + data[0].values[0].lat + ';;??????????????: ;' + data[0].values[0].lon + ';;;;;;;;;;;;;;;\r\n';
                    str_hdr += ';;;??????????;;;;;;;;???????????????????????? ;????????????????, ;????/??3;;;;;;;;;;;;;;;;;;;;\r\n';
                    str_hdr += '????????;????????;????????., ?? ;????????., ????. ;????????????????, ??/?? ;??????. ????????., % ;NO          ;NO2          ;NH3          ;SO2          ;H2S          ;O3          ;CO          ;CH2O        ;PM1          ;PM2.5        ;PM10        ;???????? ??????????;????????????      ;????????????      ;????????????????????;??,??-????????????;??-????????????;????????????????????;????????????      ;??????????       ;;;;;;;;\r\n';




                    var str_body = '';

                    var i = 0;
                    pollution.forEach((item, i) => {

                        str_body += item.day + ';' + item.time + ';' + item.tempr + ';' + item.dir + ';' + item.spd + ';' + item.hum + ';' +
                            item.valueNO + ';' + item.valueNO2 + ';' + item.valueNH3 + ';' + item.valueSO2 +
                            ';' + item.valueH2S + ';' + item.valueO3 + ';' + item.valueCO + ';' + item.valueCH2O + ';' + item.valuePM1 + ';' + item.valuePM25 + ';' + item.valuePM10 +
                            ';' + item.valueTSP + ';' + item.valueC6H6 + ';' + item.valueC7H8 + ';' + item.valueC8H10 + ';' + item.valueC8H10MP + ';' + item.valueC8H10O + ';' + item.valueC6H5Cl +
                            ';' + item.valueC8H8 + ';' + item.valueC6H5OH + ';' + ';' + ';;;;;;';





                        str_body += '\r\n';
                    });




                    //'D ??? ????????, P ??? ?????????????? ??????????????????????????, SumQc ??? ?????????? ???????????????????????? ???? ??????????, n ??? ?????????? ?????????????? ???? ??????????, Qc ??? ?????????????? ???????????????????????? ???? ??????????, Qm ??? ???????????????????????? ???????????????????????? ???? ??????????, TQm ??? ?????????? ?????????????????????? ???????????????????????? ???????????????????????? ???? ??????????, Tq ??? ?????????????????????????????????? ?????????????? ?????? Q > ??????, ?? ??? ?????????? ?????????????? ???? ?????????? (SumQc, n, Qc), Max Qc ??? ???????????????????????? ???????????????????????????? ???????????????????????? ???? ??????????, TmaxQc ??? ???????? ???????????????????? MaxQc, SumDcc ??? ???????????????????? ???????? ?? Q?? > ??????????.';


                    var file = [str_hdr + '\r\n' + str_body];

                    var blob = new Blob([file], { type: "text/plain;charset=utf-8" });

                    saveAs(blob, filename);
                }
            }

        }
    };

    handleClose = () => {
        this.setState({ anchorEl: null });

    };

    handleChangeCheck = event => {
        this.props.handleToggleMeteo(event.target.name, event);
    }

    handleChange = name => event => {
        if (this.props.checkedMeteo) {
            const { options } = this.state;

            // indx = options.chemical.indexOf(name);
            for (var key in options) {
                if (options[key].chemical === name) {
                    options[key]['visible'] = event.target.checked;

                };
            };

            this.setState({ options });
            this.props.hideLine({ options });

        } else {
            const { meteoOptions } = this.state;

            // indx = options.chemical.indexOf(name);
            for (var key in meteoOptions) {
                if (meteoOptions[key].header === name) {
                    meteoOptions[key]['visible'] = event.target.checked;

                };
            };

            this.setState({ meteoOptions });
            this.props.hideLine({ meteoOptions });

        };
    };
    handleSelectChange = event => {
        const { stationsList } = this.props;
        let filter = stationsList.filter((item, i, arr) => {
            return item.namestation == event.target.value;
        });

        this.setState({ [event.target.name]: event.target.value });
        if (this.props.report_type == 'tza4') {
            if (!isEmpty(this.state.chemical)) {
                this.props.handleReportChange({
                    station_name: event.target.value, station_actual: filter[0].id,
                    chemical: this.state.chemical
                });
            }
        } else {
            if (!isEmpty(filter))
                this.props.handleReportChange({ station_name: event.target.value, station_actual: filter[0].id });
        }
    };

    handleSelectChemicalChange = event => {
        const { stationsList } = this.props;
        const { station_name } = this.state;

        let filter = stationsList.filter((item, i, arr) => {
            return item.namestation == station_name;
        });

        this.setState({ [event.target.name]: event.target.value });
        if (!isEmpty(station_name))
            this.props.handleReportChange({ station_name: station_name, station_actual: filter[0].id, chemical: event.target.value });
    };

    handlePickerChange = (event) => {
        const value = event.target.value;
        const id = event.target.id;

        if (this.props.report_type == 'operative') {
            this.props.handlePickerChange(value);
        }
        
        if (this.props.report_type == 'daily') {
            dateAddReportAction({ 'dateReportBegin': value + 'T00:00' });
            dateAddReportAction({ 'dateReportEnd': value + 'T23:59' });
            if (!isEmpty(this.props.station_name)) {
                this.props.handleReportChange({
                    station_name: this.props.station_name, station_actual: this.props.station_actual,
                    'dateReportBegin': value + 'T00:00', 'dateReportEnd': value + 'T23:59', chemical: this.state.chemical
                });

            }
        }

        if (this.props.report_type == 'monthly') {
            var dateReportBegin = new Date(new Date(value).getFullYear(), new Date(value).getMonth(), '1', '0', '0').format('Y-MM-ddTHH:mm');
            var dateReportEnd = new Date(new Date(value).getFullYear(), new Date(value).getMonth(), this.daysInMonth(new Date(value).getMonth()), '23', '59').format('Y-MM-ddTHH:mm');
            dateAddReportAction({ 'dateReportBegin': dateReportBegin });
            dateAddReportAction({ 'dateReportEnd': dateReportEnd });

            if (!isEmpty(this.props.station_name)) {
                this.props.handleReportChange({
                    station_name: this.props.station_name, station_actual: this.props.station_actual,
                    'dateReportBegin': dateReportBegin, 'dateReportEnd': dateReportEnd
                });

            }

        }

        if ((this.props.report_type == 'tza4') || (this.props.report_type == 'tza4_auto')) {
            var dateReportBegin = new Date(new Date(value).getFullYear(), new Date(value).getMonth(), '1', '0', '0').format('Y-MM-ddTHH:mm');
            var dateReportEnd = new Date(new Date(value).getFullYear(), new Date(value).getMonth(), this.daysInMonth(new Date(value).getMonth()), '23', '59', '59').format('Y-MM-ddTHH:mm:SS');
            dateAddReportAction({ 'dateReportBegin': dateReportBegin });
            dateAddReportAction({ 'dateReportEnd': dateReportEnd });

            if (!isEmpty(this.props.station_name) && !isEmpty(this.state.chemical) && (this.props.report_type == 'tza4')) {
                this.props.handleReportChange({
                    station_name: this.props.station_name, station_actual: this.props.station_actual,
                    'dateReportBegin': dateReportBegin, 'dateReportEnd': dateReportEnd, chemical: this.state.chemical
                });

            }
            if (!isEmpty(this.props.station_name) && (this.props.report_type == 'tza4_auto')) {
                this.props.handleReportChange({
                    station_name: this.props.station_name, station_actual: this.props.station_actual,
                    'dateReportBegin': dateReportBegin, 'dateReportEnd': dateReportEnd, chemical: this.state.chemical
                });
            }



        }

    };

    componentWillMount() {
        var dateReportBegin = new Date().format('Y-MM-ddT00:00');
        var dateReportEnd = new Date().format('Y-MM-ddTHH:mm');
        dateAddReportAction({ 'dateReportBegin': dateReportBegin });
        dateAddReportAction({ 'dateReportEnd': dateReportEnd });
    };

    render() {

        const { classes, checked_meteo } = this.props;
        const { anchorEl } = this.state;
        const { stationsList } = this.props;
        const { chemical_list } = this.state;
        let namestation = '';
        let filter = stationsList.filter((item, i, arr) => {
            return item.id == this.state.station_actual;
        });
        if (!isEmpty(filter)) namestation = filter[0].namestation;

        //console.log('menu '+stationsList);
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
        return (
            <div>


                <Paper >

                    <nav className="navbar form-control">


                        <div className="navbar-header">
                            <form className={classes.root} autoComplete="off">
                                <FormControl className={classes.formControl}>

                                    <InputLabel htmlFor="station_name" >?????????? ???? ??????????????</InputLabel>

                                    <Select
                                        value={this.state.station_name}
                                        onChange={this.handleSelectChange}
                                        inputProps={{
                                            name: 'station_name',
                                            id: 'station_name_' + this.props.report_type,
                                        }}>
                                        {(stationsList) &&// if not empty
                                            stationsList.map((option, i) => (
                                                <MenuItem key={option.namestation} value={option.namestation}>
                                                    {option.namestation}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>


                                </FormControl>
                            </form>

                        </div>

                        {(this.state.report_type == 'operative') &&
                            <TextField
                                id="dateReportBegin"
                                label="???????????????????? ??????????????"
                                type="datetime-local"
                                value={new Date(this.props.dateReportEnd).format('Y-MM-ddTHH:mm')}
                                className={classes.textFieldWidest}
                                // selectProps={this.state.dateReportBegin}
                                onChange={(event) => { this.handlePickerChange(event) }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />}
                        {(this.state.report_type == 'daily') &&
                            <TextField
                                id="dateReportBegin"
                                label="???????? ????????????"
                                type="date"
                                defaultValue={new Date(this.props.dateReportBegin).format('Y-MM-dd')}
                                value={new Date(this.props.dateReportBegin).format('Y-MM-dd')}
                                className={classes.textField}
                                // selectProps={this.state.dateReportBegin}
                                onChange={(event) => { this.handlePickerChange(event) }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />}

                        {(this.state.report_type == 'monthly') && <TextField
                            id="dateReportBegin"
                            label="???????? ????????????"
                            type="month"
                            defaultValue={new Date(this.props.dateReportBegin).format('Y-MM')}
                            className={classes.textFieldWide}
                            value={new Date(this.props.dateReportBegin).format('Y-MM')}
                            // selectProps={this.state.dateReportBegin}
                            onChange={(event) => { this.handlePickerChange(event) }}
                            InputLabelProps={{
                                shrink: true,
                            }}


                        />}

                        {((this.state.report_type == 'tza4') || ((this.state.report_type == 'tza4_auto'))) && <TextField
                            id="dateReportBegin"
                            label="???????? ????????????"
                            type="month"
                            defaultValue={new Date(this.props.dateReportBegin).format('Y-MM')}
                            value={new Date(this.props.dateReportBegin).format('Y-MM')}
                            className={classes.textFieldWide}
                            // selectProps={this.state.dateReportBegin}
                            onChange={(event) => { this.handlePickerChange(event) }}
                            InputLabelProps={{
                                shrink: true,
                            }}


                        />}
                        {(this.state.report_type == 'tza4') && <form className={classes.root} autoComplete="off">


                            <FormControl className={classes.formControl}>

                                <InputLabel htmlFor="chemical" >??????????????????</InputLabel>
                                <Select
                                    value={this.state.chemical}
                                    onChange={this.handleSelectChemicalChange}
                                    inputProps={{
                                        name: 'chemical',
                                        id: 'chemical',
                                    }}>
                                    {(stationsList) && chemical_list.map((option, i) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))
                                    }
                                </Select>

                            </FormControl>&nbsp;
                            <FormControlLabel className={classes.root}
                                control={<Checkbox style={{ 'padding': '0px', 'paddingLeft': '15px', 'paddingRight': '5px' }} checked={checked_meteo} onChange={this.handleChangeCheck} name="checked_meteo" color="primary" />}
                                label="  ?? ????????????????????????????????"
                            />
                        </form>}

                        <div className={classes.root}>


                            <Tooltip id="tooltip-charts-view4" title="?????????????? ?? Word">
                                <IconButton className={classes.button} onClick={this.handleWordClick} aria-label="?????????????? ?? Word">
                                    <SvgIcon className={classes.icon}>
                                        <path d="M6,2H14L20,8V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M13,3.5V9H18.5L13,
                                    3.5M7,13L8.5,20H10.5L12,17L13.5,20H15.5L17,
                                    13H18V11H14V13H15L14.1,17.2L13,15V15H11V15L9.9,17.2L9,13H10V11H6V13H7Z" />
                                    </SvgIcon>
                                </IconButton>

                            </Tooltip>
                            <Tooltip id="tooltip-charts-view4" title="?????????????? ?? Excel">

                                <IconButton className={classes.button} onClick={this.handleExcelClick} aria-label="?????????????? ?? Excel">
                                    <SvgIcon className={classes.icon}>
                                        <path d="M6,2H14L20,8V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M13,3.5V9H18.5L13,
                                    3.5M17,11H13V13H14L12,14.67L10,13H11V11H7V13H8L11,15.5L8,18H7V20H11V18H10L12,16.33L14,
                                    18H13V20H17V18H16L13,15.5L16,13H17V11Z" />
                                    </SvgIcon>
                                </IconButton>

                            </Tooltip>






                        </div>



                        <Snackbar
                            open={this.props.isLoading}
                            // TransitionComponent={<Slider direction="up" />}
                            autoHideDuration={this.props.autoHideDuration}
                            onClose={this.props.handleSnackClose}

                            message={<span id="message-id">{this.props.snack_msg}</span>}

                        />
                    </nav>
                </Paper> <br /></div >
        );
    }
}
//<MenuItem key={option} selected={option === 'Pyxis'} onClick={this.handleClose}>
//   {option}
// </MenuItem>



function mapStateToProps(state) {
    return {
        dateReportBegin: state.datePickers.dateReportBegin,
        dateReportEnd: state.datePickers.dateReportEnd

    };
}

MenuReport.propTypes = {

    classes: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(withStyles(styles)(MenuReport));