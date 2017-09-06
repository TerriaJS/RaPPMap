import React from 'react';

import version from '../../version';

import StandardUserInterface from 'terriajs/lib/ReactViews/StandardUserInterface/StandardUserInterface.jsx';
import MenuItem from 'terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuItem';
import RelatedMaps from './RelatedMaps';
import { Menu, Nav } from 'terriajs/lib/ReactViews/StandardUserInterface/customizable/Groups';
import MeasureTool from 'terriajs/lib/ReactViews/Map/Navigation/MeasureTool';
import CatalogShortcut from 'terriajs/lib/ReactViews/Map/Navigation/CatalogShortcut.jsx';
import Icon from "terriajs/lib/ReactViews/Icon.jsx";

import './global.scss';

export default function UserInterface(props) {
    return (
        <StandardUserInterface {... props} version={version}>
            <Menu>
                <RelatedMaps viewState={props.viewState} />
                <MenuItem caption="About" href="about.html" key="about-link"/>
            </Menu>
            <Nav>
                <MeasureTool terria={props.viewState.terria} key="measure-tool"/>
                <CatalogShortcut terria={props.terria} viewState={props.viewState} catalogMember={props.terria.catalog.group.items[0].items[0]} glyph={Icon.GLYPHS.barChart}/>
            </Nav>
        </StandardUserInterface>
    );
}