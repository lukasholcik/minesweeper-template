///<reference path="ref.d.ts"/>

import * as api from "./common/api";
import MinefieldService from "./services/minefield.service";
import MinefieldController from "./components/minefield/minefield.controller";
import {MinefieldCellStatus} from "./common/api";
import {MinefieldData} from "./common/api";
import GameController from "./components/game/game.controller";

function getCompiledElement($compile:ng.ICompileService, directive:string, $scope:ng.IScope):ng.IAugmentedJQuery {
    const el = angular.element(directive);
    const compiledElement = $compile(el)($scope);

    $scope.$apply();
    return compiledElement;
}

describe("SolarWinds MineSweeper >", ()=> {

    let $scope:any,
        $controller:ng.IControllerService,
        $compile:ng.ICompileService,
        minefieldService:MinefieldService,
        smallMinefield:MinefieldData;
    beforeEach(angular.mock.module("minesweeper"));

    beforeEach(inject(($injector:any)=> {
        $controller = $injector.get("$controller");
        $scope = $injector.get("$rootScope").$new();
        $compile = $injector.get("$compile");
        minefieldService = $injector.get("swMinefieldService");

        // Minefield that looks like: 01X2X
        smallMinefield = new api.MinefieldData(5, 1, 1, [
            [
                {
                    x: 0,
                    y: 0,
                    hasMine: false,
                    status: api.MinefieldCellStatus.HIDDEN,
                    neighbours: 0
                },
                {
                    x: 1,
                    y: 0,
                    hasMine: false,
                    status: api.MinefieldCellStatus.HIDDEN,
                    neighbours: 1
                },
                {
                    x: 2,
                    y: 0,
                    hasMine: true,
                    status: api.MinefieldCellStatus.HIDDEN,
                    neighbours: 8
                },
                {
                    x: 3,
                    y: 0,
                    hasMine: false,
                    status: api.MinefieldCellStatus.HIDDEN,
                    neighbours: 2
                },
                {
                    x: 4,
                    y: 0,
                    hasMine: true,
                    status: api.MinefieldCellStatus.HIDDEN,
                    neighbours: 0
                }
            ]
        ]);

    }));

    /**
     * In `minefield.directive.html` you can see the first cell already rendered. Your task is to display all cells
     * in the minefield. The two dimensional array is available as vm.minefield.matrix. Display the matrix as a
     * table.
     */
    it("1. shows minefield matrix for given data", ()=> {
        const height = 10;
        const width = 10;
        const randomMinefield = minefieldService.newMinefield(width, height, 10);

        $scope.minefield = randomMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        expect(element.find(".sw-cell").length).toBe(height * width);
    });

    /**
     * In the cell.controller.ts controller class you see a getButtonClasses() method that returns an object that
     * being passed to ng-class on the button. Your task here is to implement the sw-cell__button--hidden condition.
     * To access the cell state value use this.cellData.status. Find the possible value in the MinefieldCellStatus
     * class in common/api.ts
     */
    it("2. adds .sw-cell__button--hidden class when the sw-cell button status is" +
        " MinefieldCellStatus.HIDDEN", ()=> {
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        expect(element.find(".sw-cell__button:first").hasClass("sw-cell__button--hidden")).toBe(true);
    });

    /**
     * When user clicks the button in cell.directive.html, it should trigger the on-click callback that's being
     * passed from minefield.directive.html. Don't forget to pass the `cellData` argument properly (hint:
     * vm.onClick({cellData: ...}))
     */
    it("3. executes the on-click callback with proper cellData when the .sw-cell__button is" +
        " clicked", ()=> {
        $scope.cellData = smallMinefield.matrix[0][0];
        $scope.onClick = (cellData:api.IMinefieldCell)=> {
        };

        const eventSpy = spyOn($scope, "onClick");

        const html = `<sw-cell cell-data="cellData" on-click="onClick(cellData)"></sw-cell>`;
        const element = getCompiledElement($compile, html, $scope);

        element.find(".sw-cell__button:first").triggerHandler("click");
        $scope.$apply();

        expect(eventSpy).toHaveBeenCalledWith(jasmine.anything(), $scope.cellData);
    });

    /**
     * After clicking on the cell, reveal the cell so that it shows what's hidden. `swMinefieldService.reveal()` is
     * your friend and it will do the necessary magic for you, just call it with correct arguments. You can find the
     * service in `services/minefield.service.ts`. Don't forget to access it as `this.swMinefieldService` in
     * TypeScript class.
     */
    it("4. uses swMinefieldService.reveal() to reveal the cell", ()=> {
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        element.find(".sw-cell__button:first").triggerHandler("click");
        $scope.$apply();
        expect($(element.find(".sw-cell__button")[0]).hasClass("sw-cell__button--revealed")).toBe(true);
        expect($(element.find(".sw-cell__button")[1]).hasClass("sw-cell__button--revealed")).toBe(true);
    });

    /**
     * In cell.directive.html, you're expected to display the number of mines on adjacent cells. Access this information
     * through `vm.cellData.neighbours`. Show the number only when it's > 0 when the cell is revealed (check
     * cellData.status) and when there isn't a mine (!vm.cellData.hasMine). See the prepared method getButtonText()
     * in cell.controller.ts.
     */
    describe("shows number of neighbours on the cell button", ()=> {
        it("5. show number on revealed cell", ()=>{
            $scope.minefield = smallMinefield;

            const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
            const element = getCompiledElement($compile, html, $scope);

            const firstCell = $(element.find(".sw-cell__button")[0]);
            const secondCell = $(element.find(".sw-cell__button")[1]);
            expect(secondCell.text().trim()).not.toBe("1");

            firstCell.triggerHandler("click");
            $scope.$apply();

            expect(secondCell.text().trim()).toBe("1");
        });

        it("6. doesn't show number when neighbours === 0", ()=>{
            $scope.minefield = smallMinefield;

            const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
            const element = getCompiledElement($compile, html, $scope);

            const firstCell = $(element.find(".sw-cell__button")[0]);
            const secondCell = $(element.find(".sw-cell__button")[1]);

            firstCell.triggerHandler("click");
            $scope.$apply();

            expect(secondCell.text().trim()).toBe("1");
            expect(firstCell.text().trim()).not.toBe("0");
        });

        it("7. doesn't show number on revealed cell with mine", ()=> {
            $scope.minefield = smallMinefield;

            const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
            const element = getCompiledElement($compile, html, $scope);

            // just check previous use-case
            const secondCell = $(element.find(".sw-cell__button")[1]);
            secondCell.triggerHandler("click");
            $scope.$apply();
            expect(secondCell.text().trim()).toBe("1");

            const mineCell = $(element.find(".sw-cell__button")[2]);
            mineCell.triggerHandler("click");
            $scope.$apply();
            expect(mineCell.text().trim()).toBe("");
        });
    });

    /**
     * The buttons don't have proper sizing when there is no text displayed. Show &nbsp; on the cell button without
     * text (i.e. without neighbour count information).
     */
    describe("shows &nbsp; on a cell button", ()=>{

        it("8. shows &nbsp; on hidden cell", ()=> {
            $scope.minefield = smallMinefield;

            const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
            const element = getCompiledElement($compile, html, $scope);

            const firstCell = $(element.find(".sw-cell__button")[0]);
            // before reveal
            expect(firstCell.hasClass("sw-cell__button--hidden")).toBe(true);
            expect(firstCell.html().trim()).toBe("&nbsp;");
        });

        it("9. shows &nbsp; on revealed cell with no neighbours", ()=> {
            $scope.minefield = smallMinefield;

            const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
            const element = getCompiledElement($compile, html, $scope);

            const firstCell = $(element.find(".sw-cell__button")[0]);

            firstCell.triggerHandler("click");
            $scope.$apply();
            // after reveal
            expect(firstCell.html().trim()).toBe("&nbsp;");
        });

    });

    /*
     * BUTTON CLASSES
     */

    /**
     * Let's look at button classes in cell.controller.ts again ... we need to add the .sw-cell__button--neighbour-X
     * class to the button where X = vm.cellData.neighbours to make it more colorful. The conditions are:
     * 1. only add the class when the cell is revealed so that the user can't figure out anything from the page source
     * 2. don't add the class when `neighbours === 0`
     */
    describe(".sw-cell__button--neighbour-* class", ()=>{
        it("10. class is not added to hidden cells", ()=> {
            $scope.minefield = smallMinefield;

            const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
            const element = getCompiledElement($compile, html, $scope);

            const firstCell = $(element.find(".sw-cell__button")[0]);
            const secondCell = $(element.find(".sw-cell__button")[1]);

            expect(firstCell.hasClass("sw-cell__button--neighbours-0")).toBe(false);
            expect(secondCell.hasClass("sw-cell__button--neighbours-1")).toBe(false);
        });

        it("11. class is not added when neighbours === 0", ()=> {
            $scope.minefield = smallMinefield;

            const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
            const element = getCompiledElement($compile, html, $scope);

            const firstCell = $(element.find(".sw-cell__button")[0]);
            const secondCell = $(element.find(".sw-cell__button")[1]);

            firstCell.triggerHandler("click");
            $scope.$apply();

            expect(firstCell.hasClass("sw-cell__button--neighbours-0")).toBe(false);
        });

        it("12. class is added when revealed and neighbours > 0", ()=> {
            $scope.minefield = smallMinefield;

            const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
            const element = getCompiledElement($compile, html, $scope);
            const firstCell = $(element.find(".sw-cell__button")[0]);
            const secondCell = $(element.find(".sw-cell__button")[1]);

            firstCell.triggerHandler("click");
            $scope.$apply();

            expect(secondCell.hasClass("sw-cell__button--neighbours-1")).toBe(true);
        });

    });

    /**
     * When the cell is revealed and there is a mine on the cell, there should be a .sw-cell__button--has-mine on
     * the button.
     */
    it("13. should add .sw-cell__button--has-mine class to revealed cell button with a mine", ()=> {
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        const mineCell = $(element.find(".sw-cell__button")[2]);
        expect(mineCell.hasClass("sw-cell__button--has-mine")).toBe(false);
        mineCell.triggerHandler("click");
        $scope.$apply();
        expect(mineCell.hasClass("sw-cell__button--has-mine")).toBe(true);
    });

    /*
     * GAME STATUS
     */

    /**
     * In minefield.controller.ts, there is a gameStatus property. Set and use this information to disable the whole
     * minefield once the user reveals a cell with mine present.
     */
    it("14. should disable whole minefield (all minefield cell buttons) after revealing a " +
        "cell with a mine - i.e. player loses the game", ()=> {
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        const mineCell = $(element.find(".sw-cell__button")[3]);
        mineCell.triggerHandler("click");
        $scope.$apply();
        for (let i = 0; i < 3; i++) {
            const cell = $(element.find(".sw-cell__button")[i]);
            expect(cell.is("[disabled]")).toBe(true);
        }
    });

    /**
     * To satisfy this test you need to keep track of number of revealed cells. The swMinefieldService.reveal()
     * method returns number of revealed cells so you'll need to accumulate this number until it reaches total cells
     * - number of mines. Minefield info like dimensions and number of mines is accessible in
     * `minefield.controller.ts` through `vm.minefield` attributes `height`, `width`, `mines`.
     */
    it("15. should disable whole minefield (all minefield cell buttons) after revealing " +
        "all cells without mines - i.e. player wins the game", ()=> {
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        $(element.find(".sw-cell__button")[1]).triggerHandler("click");
        $scope.$apply();
        $(element.find(".sw-cell__button")[0]).triggerHandler("click");
        $scope.$apply();

        for (let i = 0; i < 3; i++) {
            const cell = $(element.find(".sw-cell__button")[i]);
            expect(cell.is("[disabled]")).toBe(true);
        }
    });

    /*
     * FLAGGED CELLS
     */

    /**
     * In Windows MineSweeper it's possible to flag a suspected cell, so that you can avoid it in the future. Original
     * game uses right-click for this, but in browsers it's tricky to handle anything other than left-click, so we'll
     * use shift+click for this feature. Change the cell status to MinefieldCellStatus.FLAGGED when the user clicks a
     * hidden cell with shift key pressed.
     */
    it("16. shift+click on hidden cell should set the state to FLAGGED", ()=> {
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        const firstCell = element.find(".sw-cell__button:first");
        var shiftClick = jQuery.Event("click");
        shiftClick.shiftKey = true;
        firstCell.triggerHandler(shiftClick);
        $scope.$apply();
        expect(firstCell.hasClass("sw-cell__button--flagged")).toBe(true);
    });

    /**
     * Flagging shouldn't work for revealed cells.
     */
    it("17. shift+click on revealed cell shouldn't flag it", ()=> {
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        const firstCell = element.find(".sw-cell__button:first");
        firstCell.triggerHandler("click");
        $scope.$apply();
        expect(firstCell.hasClass("sw-cell__button--revealed")).toBe(true);

        var shiftClick = jQuery.Event("click");
        shiftClick.shiftKey = true;
        firstCell.triggerHandler(shiftClick);
        $scope.$apply();
        expect(firstCell.hasClass("sw-cell__button--flagged")).not.toBe(true);
    });

    /**
     * Clicking on a flagged cell should set the state back to HIDDEN.
     */
    it("18. click on flagged cell should set the state to HIDDEN", ()=> {
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);
        const firstCell = element.find(".sw-cell__button:first");
        expect(firstCell.hasClass("sw-cell__button--hidden")).toBe(true);

        var shiftClick = jQuery.Event("click");
        shiftClick.shiftKey = true;
        firstCell.triggerHandler(shiftClick);
        $scope.$apply();
        expect(firstCell.hasClass("sw-cell__button--revealed")).toBe(false);
        expect(firstCell.hasClass("sw-cell__button--flagged")).toBe(true);

        firstCell.triggerHandler("click");
        $scope.$apply();
        expect(firstCell.hasClass("sw-cell__button--flagged")).toBe(false);
        expect(firstCell.hasClass("sw-cell__button--hidden")).toBe(true);
    });

    /**
     * When player clicks a cell with a mine, all the mines on the minefield should be revealed.
     */
    it("19. should reveal all mines when game was lost", ()=> {
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        const mineCell1 = $(element.find(".sw-cell__button")[2]);
        mineCell1.triggerHandler("click");
        $scope.$apply();

        const mineCell2 = $(element.find(".sw-cell__button")[4]);

        expect(mineCell1.hasClass("sw-cell__button--revealed")).toBe(true);
        expect(mineCell2.hasClass("sw-cell__button--revealed")).toBe(true);
    });

    /*
     * RESTART BUTTON
     */

    describe("restart button", ()=>{
        /**
         * In `game.directive.html` there is a button that should restart the game when you click on it. You can find the logic
         * that initializes the minefield in `game.controller.ts`
         */
        it("20. restarts the game by clicking on the `sw-game__restart-button`", ()=> {
            const html = `<sw-game></sw-game>`;
            const element = getCompiledElement($compile, html, $scope);

            const minefieldCtrl = <MinefieldController> element.find(".sw-minefield").controller("swMinefield");
            minefieldCtrl.minefield = smallMinefield;
            $scope.$apply();

            // click on a mine to make sure the game is lost
            const mineCell = $(element.find(".sw-cell__button")[2]);
            mineCell.triggerHandler("click");
            $scope.$apply();
            expect(minefieldCtrl.minefield.matrix[0][2].status).toBe(MinefieldCellStatus.REVEALED);

            const restartButton = element.find(".sw-game__restart-button");
            restartButton.triggerHandler("click");

            // make sure all cells are hidden again
            for (let cell of minefieldCtrl.minefield.matrix[0]) {
                expect(cell.status).toBe(MinefieldCellStatus.HIDDEN);
            }
        });

        /**
         * While the game is in progress (GameController.gameStatus === EGameStatus.IN_PROGRESS), there should be a
         * .sw-game__restart-button--in-progress class on the restart button.
         */
        it("21. adds sw-game__restart-button--in-progress class to button while the game is in progress", ()=> {
            const html = `<sw-game></sw-game>`;
            const element = getCompiledElement($compile, html, $scope);

            const gameCtrl:GameController = element.controller("swGame");
            gameCtrl.gameStatus = api.EGameStatus.IN_PROGRESS;
            $scope.$apply();

            var restartButton = element.find(".sw-game__restart-button");
            expect(restartButton.hasClass("sw-game__restart-button--in-progress")).toBe(true);
        });

        /**
         * Add .sw-game__restart-button--fail class on the restart button when the player lost the game.
         */
        it("22. adds sw-game__restart-button--fail class to restart button when the player lost the game", ()=> {
            const html = `<sw-game></sw-game>`;
            const element = getCompiledElement($compile, html, $scope);

            const gameCtrl:GameController = element.controller("swGame");
            gameCtrl.gameStatus = api.EGameStatus.FAIL;
            $scope.$apply();

            var restartButton = element.find(".sw-game__restart-button");
            expect(restartButton.hasClass("sw-game__restart-button--fail")).toBe(true);
        });

        /**
         * Add .sw-game__restart-button--fail class on the restart button when the player lost the game.
         */
        it("23. adds sw-game__restart-button--success class to restart button when the player won the game", ()=> {
            const html = `<sw-game></sw-game>`;
            const element = getCompiledElement($compile, html, $scope);

            const gameCtrl:GameController = element.controller("swGame");
            gameCtrl.gameStatus = api.EGameStatus.SUCCESS;
            $scope.$apply();

            var restartButton = element.find(".sw-game__restart-button");
            expect(restartButton.hasClass("sw-game__restart-button--success")).toBe(true);
        });

    });

    ///**
    // * Show a counter that shows [total_number_of_mines - flagged_cells].
    // */
    //it("24. shows the number of remaining mines in .sw-game__countdown element", ()=> {
    //
    //});
    //
    ///**
    // *
    // */
    //it("25. should reveal all adjacent cells with ctrl+click if number of flagged adjacent cells equals" +
    //    " cellData.neighbours ", ()=>{
    //});

});
