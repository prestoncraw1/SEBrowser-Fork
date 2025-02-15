﻿//******************************************************************************************************
//  EventSearchMagDurChart.tsx - Gbtc
//
//  Copyright © 2020, Grid Protection Alliance.  All Rights Reserved.
//
//  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
//  the NOTICE file distributed with this work for additional information regarding copyright ownership.
//  The GPA licenses this file to you under the MIT License (MIT), the "License"; you may not use this
//  file except in compliance with the License. You may obtain a copy of the License at:
//
//      http://opensource.org/licenses/MIT
//
//  Unless agreed to in writing, the subject software distributed under the License is distributed on an
//  "AS-IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. Refer to the
//  License for the specific language governing permissions and limitations.
//
//  Code Modification History:
//  ----------------------------------------------------------------------------------------------------
//  06/23/2020 - Billy Ernest
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import { select, scaleLinear, scaleLog, axisBottom, format as d3format, line, zoom as d3zoom, axisLeft} from 'd3';
import * as _ from 'lodash';
import { SelectEventSearchsStatus, FetchEventSearches, SelectEventSearchs } from './EventSearchSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { OpenXDA, Redux, SEBrowser } from '../../global';
import { MagDurCurveSlice } from '../../Store';
import { Line, Plot, Circle, AggregatingCircles } from '@gpa-gemstone/react-graph';
import { SelectEventSearchSettings } from '../SettingsSlice';


interface IProps {
    Height: number,
    EventID: number,
    SelectEvent: (id: number) => void,
}
const MagDurChart = (props: IProps) => {

    const chart = React.useRef(null);
    const count = React.useRef(null);

    const magDurStatus = useAppSelector(MagDurCurveSlice.Status);
    const magDurCurves = useAppSelector(MagDurCurveSlice.Data) as SEBrowser.MagDurCurve[];
 
    const [currentCurve, setCurrentCurve] = React.useState<SEBrowser.MagDurCurve>(null)
    const numberResults = useAppSelector((state: Redux.StoreState) => SelectEventSearchSettings(state).NumberResults)

    const [width, setWidth] = React.useState<number>(0);
    const [x, setX] = React.useState<boolean>(false);
    const [hCounter, setHCounter] = React.useState<number>(0);
    const dispatch = useAppDispatch();
    const status = useAppSelector(SelectEventSearchsStatus);
    const points: any[] = useAppSelector(SelectEventSearchs);
    const [data, setData] = React.useState<any[]>([]);

    // This needs to be used instead of a Layout effect since a Layout Effect would not get triggered since nothing is redrawn when
    // size of the parent div changes.
    React.useEffect(() => {
        setWidth(chart?.current?.offsetWidth ?? 0)

        const h = setTimeout(() => {
            setX((a) => !a)
        }, 500);

        return () => { if (h !== null) clearTimeout(h); };

    }, [x])

    React.useLayoutEffect(() => {
        setHCounter(count?.current?.offsetHeight ?? 0)
    });

    React.useEffect(() => {
        if (status != 'unitiated' && status != 'changed') return;
         dispatch(FetchEventSearches());

    }, [status]);

    React.useEffect(() => {
        if (magDurStatus == 'changed' || magDurStatus == 'unintiated')
            dispatch(MagDurCurveSlice.Fetch());
    }, [magDurStatus]);

    React.useEffect(() => {
        if (currentCurve == null && magDurCurves.length > 0)
            setCurrentCurve(magDurCurves[0]);

    }, [magDurCurves]);

    React.useEffect(() => {
        setData(points.filter(p => p['EventID'] != props.EventID).map((p) => ({
            data: [p['MagDurDuration'], p['MagDurMagnitude']],
            color: 'red',
            radius: 5,
            onClick: () => { props.SelectEvent(p['EventID'] as number) }
        })))
    }, [points])

    const baseColors = ["#A30000","#0029A3","#007A29", "#d3d3d3", "#edc240",
             "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed", "#BD9B33", "#EE2E2F",
        "#008C48", "#185AA9", "#F47D23", "#662C91", "#A21D21", "#B43894",
        "#737373"]

    function generateCurve(curve: SEBrowser.MagDurCurve) {
       
        if (curve.LowerCurve == null && curve.UpperCurve == null) {
            let pt = curve.Area.split(',');
            let cu = pt.map(point => { let s = point.trim().split(" "); return [parseFloat(s[0]), parseFloat(s[1])] as [number, number]; })
            return cu;
        }

        return [];
    }

    function AggregateCurves(d, { XTransformation, YTransformation, YInverseTransformation, XInverseTransformation }) {
        const xmax = Math.max(...d.map(c => XTransformation(c.data[0]))) + 5;
        const ymax = Math.max(...d.map(c => YTransformation(c.data[1]))) + 5;
        const xmin = Math.min(...d.map(c => XTransformation(c.data[0]))) - 5 ;
        const ymin = Math.min(...d.map(c => YTransformation(c.data[1]))) - 5;
        const xcenter = 0.5*(xmax + xmin);
        const ycenter = 0.5 * (ymax + ymin);
        const r = Math.max(Math.abs(xmax - xcenter), Math.abs(xmin - xcenter), Math.abs(ymax - ycenter), Math.abs(ymin - ycenter) )
        return {
            data: [XInverseTransformation(xcenter), YInverseTransformation(ycenter)] as [number, number],
            color: 'rgb(108, 117, 125)',
            borderColor: 'black',
            borderThickness: 2,
            text: d.length.toString(),
            radius: r,
            opacity: 0.5,
            onClick: ({ setTDomain, setYDomain }) => {
                setTDomain([XInverseTransformation(xmax), XInverseTransformation(xmin)]);
                setYDomain([YInverseTransformation(ymax), YInverseTransformation(ymin)]);
            }
        };
    }

    function CanAggregate(d1, d2, { XTransformation, YTransformation }) {
        const dx = XTransformation(d1.data[0]) - XTransformation(d2.data[0]);
        const dy = YTransformation(d1.data[1]) - YTransformation(d2.data[1]);
        const r = d1.radius + d2.radius;
        return (Math.pow(dx,2) + Math.pow(dy,2) < Math.pow(r,2));
    }
    return (
        <div ref={chart} style={{ height: props.Height, width: '100%', display: 'inline-block' }}>
            <Plot height={props.Height - hCounter} width={width} showBorder={false}
                defaultTdomain={[0.00001, 1000]}
                defaultYdomain={[0, 5]}
                Tmax={1000}
                Tmin={0.00001}
                Ymax={9999}
                Ymin={0}
                legend={'right'}
                Tlabel={'Duration (s)'}
                Ylabel={'Magnitude (pu)'}
                showMouse={false}
                showGrid={true}
                zoomMode={'Rect'}
                zoom={true} pan={false} useMetricFactors={false} XAxisType={'log'} onSelect={() => { } }>
                {magDurCurves.map((s, i) => <Line highlightHover={false} showPoints={false} lineStyle={'-'} color={baseColors[i % baseColors.length]} data={generateCurve(s)} legend={s.Name} key={i} />)}
                <AggregatingCircles data={data}
                    canAggregate={CanAggregate}
                    onAggregation={AggregateCurves} />
                {points.filter(e => e['EventID'] == props.EventID).map((p) => (<Circle
                    data={[p['MagDurDuration'], p['MagDurMagnitude']]}
                    color={'blue'}
                    radius={5}
                     
                />))}
            </Plot> 
            {status == 'loading' ? null :
                data.length == numberResults ?
                    <div style={{ padding: 10, backgroundColor: '#458EFF', color: 'white' }} ref={count}>
                        Only the first {data.length} results are shown - please narrow your search or increase the number of results
                    </div> :
                    <div style={{ padding: 10, backgroundColor: '#458EFF', color: 'white' }} ref={count}>
                        {data.length} results
                    </div>}
        </div>
    )
}

export default MagDurChart;