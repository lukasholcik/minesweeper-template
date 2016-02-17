///<reference path="ref.d.ts"/>

import * as angular from "angular";
import components from "./components/index";
import services from "./services/index";
import views from "./views/index";

const app = angular.module("minesweeper", ["ngSanitize", "ui.router"]);

components(app);
services(app);
views(app);
