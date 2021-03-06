angular.module('starter.controllers', ['angular-svg-round-progressbar', 'starter.services', "starter.subscription", 'ionic-datepicker', 'ngCordova'])
    .controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout, $state, MyServices) {
        // Form data for the login modal
        $scope.loginData = {};
        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });
        // Triggered in the login modal to close it
        $scope.closeLogin = function() {
            $scope.modal.hide();
        };
        $ionicPopover.fromTemplateUrl('templates/modal/popover.html', {
            scope: $scope,
            cssClass: 'menupop',
        }).then(function(popover) {
            $scope.popover = popover;
        });
        $scope.closePopover = function() {
            $scope.popover.hide();
        };
        // Open the login modal
        $scope.login = function() {
            $scope.modal.show();
        };
        $scope.getName = function() {
            return $.jStorage.get("profile").name;
        };

    })
    .controller('BrowseMoreCtrl', function($scope, $stateParams, MyServices, Subscription, $state, $ionicPopup) {
        $scope.userDetails = MyServices.getAppDetails();
        MyServices.showCardQuantity(function(num) {
            $scope.totalQuantity = num;
        });
        $scope.subscription = Subscription.getObj();
        $scope.goBackHandler = function() {
            window.history.back(); //This works
        };

        MyServices.products({
            category: $stateParams.category
        }, function(data) {
            $scope.products = data.data;
        });
        $scope.emptyCartFun = function() {
            $scope.emptyCart = {};
            $scope.emptyCart._id = $.jStorage.get('profile')._id;
            $scope.emptyCart.cartProducts = [];
            MyServices.saveData($scope.emptyCart, function(data) {
                console.log(data);
                if (data.value) {
                    MyServices.showCardQuantity(function(num) {
                        $scope.totalQuantity = num;
                    });
                }

            });

        }

        $scope.productTap = function(product) {
            $scope.subscription.product[0].product = product._id;
            $scope.subscription.productDetail = product;

            if ($scope.totalQuantity === 0) {
                $state.go("app.subpage1");
            } else {
                var myPopup = $ionicPopup.show({
                    cssClass: 'productspopup',
                    title: '<img src="img/sorry.png">',
                    subTitle: 'You cannot purchase a 20L Jar plan and other products at the same time.',
                    buttons: [{

                        text: 'Empty Cart',
                        onTap: function(e) {
                            $scope.emptyCartFun();
                        }
                    }, {
                        text: 'View Cart',
                        type: 'button-positive',
                        onTap: function(e) {
                            $state.go("app.review");
                        }
                    }]
                });
                // $ionicPopup.alert({
                //     title: "Product already in Cart",
                //     template: "Please remove all the Products from the cart to proceed with Subscription Products."
                // });
            }
        };
    })
    .controller('SorryCtrl', function($scope, $stateParams) {
        $scope.goBackHandler = function() {
            window.history.back(); //This works
        };
    })
    .controller('PaymentSuccessfulCtrl', function($scope, $stateParams) {
        $scope.goBackHandler = function() {
            window.history.back(); //This works
        };
    })
    .controller('OrderHistoryCtrl', function($scope, $ionicPopup, $stateParams, MyServices) {
        $scope.goBackHandler = function() {
            window.history.back(); //This works
        };
        $scope.profile = $.jStorage.get('profile');
        $scope.proID = {};
        $scope.proID._id = $scope.profile._id;
        MyServices.getOrderByRM($scope.proID, function(data) {
            $scope.orders = data.data;
            console.log($scope.orders);
        });
        $scope.resendLinkFun = function(order) {
            console.log(order);
            $scope.order = {};
            $scope.order.orderId = order._id;
            $scope.order.mobile = order.customer.mobile;

            MyServices.resendLink($scope.order, function(data) {
                if (data.value) {
                    $ionicPopup.alert({
                        cssClass: 'removedpopup',
                        title: '<img src="img/tick.png">',
                        template: "Order link has been sent to " + $scope.order.mobile + " successfully!"
                    });
                }

            });
        };

        $scope.payRp = function(order) {
            console.log(order);
            var options = "location=no,toolbar=yes";
            var target = "_blank";
            var url = "";
            $scope.finalURL = 'http://htbt.wohlig.co.in/payment/' + order._id + '/123';
            var ref = cordova.InAppBrowser.open($scope.finalURL, target, options);
            ref.addEventListener('loadstop', function(event) {
                var url = event.url;
                console.log(url);
                if (url == "http://htbt.wohlig.co.in/sorry") {
                    ref.close();
                    var alertPopup = $ionicPopup.alert({
                        template: '<h4 style="text-align:center;">Some Error Occurred. Payment Failed</h4>'
                    });
                    alertPopup.then(function(res) {
                        alertPopup.close();
                        $state.go('wrong');
                    });
                } else if (url == "http://htbt.wohlig.co.in/thankyou") {
                    ref.close();
                    $state.go('paymentsuccess');
                }
            });

        };
    })
    .controller('WrongCtrl', function($scope, $stateParams) {
        $scope.goBackHandler = function() {
            window.history.back(); //This works
        };
    })
    .controller('SuccessCtrl', function($scope, $stateParams) {
        $scope.goBackHandler = function() {
            window.history.back(); //This works
        };
    })
    .controller('LinkExpireCtrl', function($scope, $stateParams) {
        $scope.goBackHandler = function() {
            window.history.back(); //This works
        };
    })
    .controller('CreditsCtrl', function($scope, $stateParams, $ionicSideMenuDelegate) {
        $scope.goBackHandler = function() {
            window.history.back(); //This works
        };
        $ionicSideMenuDelegate.canDragContent(false);
    })
    .controller('VerificationCtrl', function($scope, $stateParams, MyServices, $timeout, $state) {
        $scope.profile = $.jStorage.get('profile')._id;
        MyServices.getProfile($scope.profile, function(data) {
            $scope.signupForm = data.data;
            if (data.data.verification == 'Verified') {
                $.jStorage.set('profile', $scope.signupForm);
                $scope.profile = $.jStorage.get('profile');
                $state.go('app.dashboard');
                $scope.goahead = true;
            }
        });
    })
    .controller('RequirementCtrl', function($scope, $stateParams) {
        $scope.goBackHandler = function() {
            window.history.back(); //This works
        };
    })
    .controller('ReviewCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $ionicPopover) {
        $ionicPopover.fromTemplateUrl('templates/modal/terms.html', {
            scope: $scope,
            cssClass: 'menupop',

        }).then(function(terms) {
            $scope.terms = terms;
        });
    $scope.checkMinProduct = function (product) {
            if (!product.productQuantity || product.productQuantity <= 0) {
                return true;
            } else {
                return false;
            }
        };
        $scope.checkMaxProduct = function (product) {
            if (product.productQuantity >= parseInt(product.quantity)) {
                return true;
            } else {
                return false;
            }
        };
        $scope.changeProductQuantity = function (product, change) {
            if (_.isNaN(parseInt(product.productQuantity))) {
                product.productQuantity = 0;
            }
            if (change) {
                product.productQuantity++;
            } else {
                product.productQuantity--;
            }
        };
        $scope.closePopover = function() {
            $scope.terms.hide();
        };
        $scope.goBackHandler = function() {
            window.history.back(); //This works
        };
        $scope.terms = {};

        function showCart() {
            MyServices.showCart(function(data) {
                if (data.data && data.data.data) {
                    $scope.products = data.data.data;
                }
            });
        }
        showCart();
        $scope.getProductPrice = MyServices.getProductPrice;
        $scope.calculateTotalPrice = function() {
            var total = 0;
            var savingPriceTotal = 0;

            _.each($scope.products, function(n) {
                total += n.product.totalPriceUsed;
                savingPriceTotal += parseInt(n.product.price) * parseInt(n.productQuantity);
            });
            $scope.savingAmount = savingPriceTotal - total;
            $scope.savingPercent = ($scope.savingAmount / savingPriceTotal * 100);
            return total;
        };
        $scope.removeCart = function(productId) {
            MyServices.removeFromCart(productId, function(data) {
                showCart();
                if (data.status == 200) {
                    $ionicPopup.alert({
                        cssClass: 'removedpopup',
                        title: '<img src="img/tick.png">',
                        template: "Products Removed Successfully!"
                    });
                } else {
                    $ionicPopup.alert({
                        cssClass: 'productspopup',
                        title: '<img src="img/linkexpire.png">',
                        template: "Error Occured while Removing Products to Cart"
                    });
                }
            });
        };
    })
    .controller('CheckoutCtrl', function($scope, $stateParams, $ionicPopup, $state, $ionicPopover, ionicDatePicker, MyServices, Subscription) {

        $ionicPopover.fromTemplateUrl('templates/modal/terms.html', {
            scope: $scope,
            cssClass: 'menupop',

        }).then(function(terms) {
            $scope.terms = terms;
        });

        $scope.closePopover = function() {
            $scope.terms.hide();
        };

        $scope.userDetails = MyServices.getAppDetails();
        $scope.terms = {};
        MyServices.showCardQuantity(function(num) {
            $scope.totalQuantity = num;
        });
        $scope.subscription = Subscription.getObj();
        console.log($scope.subscription);
        console.log($scope.subscription.toString());
        Subscription.validate($state);
        $scope.goBackHandler = function() {
            window.history.back(); //This works
        };
        $scope.getProductPrice = MyServices.getProductPrice;
        $scope.addPlan = function(planName) {
            $scope.subscription.plan = planName;
        };

        $scope.calculateTotalPrice = function() {
            var total = 0;
            var savingPriceTotal = 0;
            $scope.totalAmt = 0;
            $scope.otherProductstotal = 0;
            $scope.totalQuantity = 0;
            $scope.deposit = 0;
            _.each($scope.subscription.otherProducts, function(n) {
                $scope.otherProductstotal += n.price * n.productQuantity;
            });
            if ($scope.subscription.productDetail.applicableBefore > $scope.subscription.product[0].quantity && $scope.subscription.plan == 'Onetime') {
                total += parseFloat($scope.subscription.productDetail.AmtDeposit) * parseInt($scope.subscription.product[0].quantity);
                $scope.deposit += parseFloat($scope.subscription.productDetail.AmtDeposit) * parseInt($scope.subscription.product[0].quantity);
            }
            total += parseInt($scope.otherProductstotal);
            $scope.totalPriceForJar = parseFloat(MyServices.getProductPrice($scope.subscription.productDetail, $scope.subscription.productQuantity)) * $scope.subscription.productQuantity;
            total += $scope.totalPriceForJar;
            return total;
        };

        $scope.cancelSubscription = function() {

            $ionicPopup.alert({
                cssClass: 'productspopup',
                title: 'Cancel Subscription',
                template: "Are you sure ?",
                buttons: [{

                    text: 'Yes',
                    onTap: function(e) {
                        $scope.subscription = {
                            product: [{
                                product: null,
                                quantity: null
                            }],
                            productDetail: null,
                            productQuantity: 0,
                            otherProducts: [],
                            customerName: null,
                            customerMobile: null,
                            totalQuantity: null,
                            totalAmt: null,
                            user: null
                        };
                        Subscription.setObj($scope.subscription);
                        console.log(Subscription.getObj());
                        $state.go('app.browse')
                    }
                }, {
                    text: 'No',
                    type: 'button-positive',
                    onTap: function(e) {}
                }]
            });

        }

        $scope.authenticatePayment = function() {

            $scope.subscription.totalAmt = $scope.totalAmt;
            $scope.subscription.totalQuantity = $scope.totalQuantity;
            $scope.subscription.deposit = $scope.deposit;
            $scope.subscription.user = $.jStorage.get('profile')._id;

            Subscription.setObj($scope.subscription);

            $state.go('app.auth-payment');
        };
    })
    .controller('AddonsCtrl', function($scope, $stateParams, $state, MyServices, Subscription, $ionicPopover) {
        $scope.goBackHandler = function() {
            window.history.back(); //This works
        };
        $scope.userDetails = MyServices.getAppDetails();
        MyServices.showCardQuantity(function(num) {
            $scope.totalQuantity = num;
        });
        $scope.subscription = Subscription.getObj();
        $scope.subscription.otherProducts = [];
        Subscription.validate($state);
        $scope.getProductPrice = MyServices.getProductPrice;
        $scope.addPlan = function(planName) {
            $scope.subscription.plan = planName;
        };
        MyServices.getOtherProducts(function(data) {
            if (data.status == 200) {
                if (data.data && data.data.data && data.data.data.results) {
                      $scope.otherProduct = data.data.data.results;
                    // $scope.otherProducts = _.groupBy(data.data.data.results, "addones");
                    // $scope.saveSpace = $scope.otherProducts["Save Space"];
                    // $scope.saveTime = $scope.otherProducts["Save Time"];
                }
            } else {
                $ionicPopup.alert({
                    cssClass: 'productspopup',
                    title: '<img src="img/linkexpire.png">',
                    template: "Error Occured while retriving Products"
                });
            }
        });
        $scope.checkMinProduct = function(product) {

            if (!product.productQuantity || product.productQuantity <= 0) {
                return true;
            } else {
                return false;
            }
        };
        $scope.checkMaxProduct = function(product) {
            if (product.productQuantity >= parseInt(product.quantity)) {
                return true;
            } else {
                return false;
            }
        };
        $scope.changeProductQuantity = function(product, change) {
            if (_.isNaN(parseInt(product.productQuantity))) {
                product.productQuantity = 0;
            }
            if (change) {
                product.productQuantity++;
            } else {
                product.productQuantity--;
            }
            $scope.addProduct(product);
        };
        $scope.addProduct = function(product) {
            _.remove($scope.subscription.otherProducts, function(n) {
                return n._id == product._id;
            });
            if (product.productQuantity > 0) {
                $scope.subscription.otherProducts.push(product);
            }
        };
    })
    .controller('Subpage3Ctrl', function($scope, $stateParams, MyServices, Subscription, $state) {

        $scope.userDetails = MyServices.getAppDetails();
        MyServices.showCardQuantity(function(num) {
            $scope.totalQuantity = num;
        });
        $scope.subscription = Subscription.getObj();
        Subscription.validate($state);
        $scope.goBackHandler = function() {
            window.history.back(); //This works
        };
        $scope.getProductPrice = MyServices.getProductPrice;
        $scope.addPlan = function(planName, times) {
            MyServices.getProductPrice($scope.subscription.productDetail, $scope.subscription.product[0].quantity * times);
            $scope.subscription.productQuantity = $scope.subscription.product[0].quantity * times;
            $scope.subscription.plan = planName;
        };
    })
    .controller('Subpage1Ctrl', function($scope, $stateParams, MyServices, Subscription, $state) {
        $scope.userDetails = MyServices.getAppDetails();
        MyServices.showCardQuantity(function(num) {
            $scope.totalQuantity = num;
        });
        $scope.subscription = Subscription.getObj();
        Subscription.validate($state);

        $scope.goToProduct = function() {
            var id = $.jStorage.get("prevId");
            $state.go("app.browse-more", {
                category: id
            });
        };
        $scope.takeToNext = function() {
            var orderedPrice = _.orderBy($scope.subscription.productDetail.priceList, function(n) {
                return parseInt(n.endRange);
            });
            var lastQuantity = 0;
            if (orderedPrice.length > 0) {
                lastQuantity = parseInt(orderedPrice[orderedPrice.length - 1].endRange);
            }
            if ($scope.subscription.product[0].quantity >= lastQuantity) {
                $state.go("app.requirement");
            } else {
                $state.go("app.subpage3");
            }
        };
    })
    .controller('AuthPaymentCtrl', function($scope, $stateParams, $ionicPopup, $state, MyServices, Subscription, $ionicPopover) {
        $scope.goBackHandler = function() {
            window.history.back(); //This works
        };
        if ($.jStorage.get("NewOrder")) {
          $scope.custId={};
          $scope.custId._id=$.jStorage.get("NewOrder");
          MyServices.getCust($scope.custId, function(data) {
            if (data.value) {
              $scope.userData={}
              $scope.userData.customerName=data.data.name;
              $scope.userData.customerMobile=data.data.mobile;
            }
          });
        }
        // if (data.status == 200) {
        //     $ionicPopup.alert({
        //         cssClass: 'productspopup',
        //         title: '<img src="img/sorry.png">',
        //         template: "This customer is already registered with another partner."
        //     });
        // } else {$ionicPopup
        //     $ionicPopup.alert({
        //         cssClass: 'productspopup',
        //         "Error Occured"
        //         title: '<img src="img/linkexpire.png">',
        //         template: "Error Occured while Removing Products to Cart"
        //     });
        // }

        $ionicPopover.fromTemplateUrl('templates/modal/pincode.html', {
            scope: $scope,
            cssClass: 'menupop',

        }).then(function(pincode) {
            $scope.pincode = pincode;
        });
        $scope.closePincode = function() {
            $scope.pincode.hide();
        };
        $scope.closePopover = function() {
            $scope.terms.hide();
        };
        $scope.openpincode = function($event) {
            $scope.pincode.show($event);
        };
        $scope.goBackHandler = function() {
            window.history.back(); //This works
        };

        $scope.userData = {};
        // ui - sref = "app.confirm"

        $scope.subscription = Subscription.getObj();
        Subscription.validate($state);
        // console.log("$scope.subscription AuthPaymentCtrl", $scope.subscription);

        $scope.submitData = function(value) {

            $scope.subscription.customerName = value.customerName;
            $scope.subscription.customerMobile = value.customerMobile;
            $scope.subscription.methodOfPayment = value.methodOfPayment;
            $scope.subscription.orderFor = 'RMForCustomer';
            console.log("$scope.subscription submitData", $scope.subscription);
            $scope.profile = $.jStorage.get('profile');
            $scope.getProfield = {};
            $scope.getProfield._id = $scope.profile._id;
            $scope.checkuser = {};
            $scope.checkuser.user = $scope.profile._id;
            $scope.checkuser.mobile = value.customerMobile;

            MyServices.getByMobileNo($scope.checkuser, function(data) {
                if (data.value) {
                    MyServices.getProfile($scope.getProfield, function(data) {
                        if (data.value) {
                            $scope.profile = data.data;
                            if ($scope.profile.earningsBlock == 'Yes') {
                                $scope.subscription.methodofjoin = 'Customer Representative';
                                $scope.subscription.methodOfOrder = 'Customer Representative';
                            } else {
                                $scope.subscription.methodofjoin = 'Relationship Partner';
                                $scope.subscription.methodOfOrder = 'Relationship Partner';
                            }
                            MyServices.saveOrderCheckout($scope.subscription, function(data) {
                              $.jStorage.set("NewOrder",null);
                                if (data.status == 200) {
                                    console.log("$scope.subscription data.data", data.data);
                                    $state.go('success');
                                } else {
                                    $state.go('wrong');
                                }
                            });
                        }
                    });
                } else {
                    $ionicPopup.alert({
                        cssClass: 'productspopup',
                        title: '<img src="img/sorry.png">',
                        template: "This customer is already registered with another partner.",
                        buttons: [{
                            text: 'ok',
                            onTap: function(e) {}
                        }, {
                            text: 'cancel',
                            onTap: function(e) {}
                        }]
                    });
                }
            });


        };
    })
    .controller('AuthPaymentCtrlCart', function($scope,$ionicPopup, $stateParams, $state, MyServices, Subscription) {
        $scope.goBackHandler = function() {
            window.history.back(); //This works
        };
        if ($.jStorage.get("NewOrder")) {
          $scope.custId={};
          $scope.custId._id=$.jStorage.get("NewOrder");
          MyServices.getCust($scope.custId, function(data) {
            if (data.value) {
              $scope.userData={}
              $scope.userData.customerName=data.data.name;
              $scope.userData.customerMobile=data.data.mobile;
            }
          });
        }
        $scope.userData = {};

        $scope.submitData = function(value) {
            value.orderFor = 'RMForCustomer';
            $scope.profile = $.jStorage.get('profile');
            $scope.getProfield = {};
            $scope.getProfield._id = $scope.profile._id;
            $scope.checkuser = {};
            $scope.checkuser.user = $scope.profile._id;
            $scope.checkuser.mobile = value.customerMobile;

            MyServices.getByMobileNo($scope.checkuser, function(data) {
                if (data.value) {
                    MyServices.getProfile($scope.getProfield, function(data) {
                        if (data.value) {
                            $scope.profile = data.data;

                            if ($scope.profile.earningsBlock == 'Yes') {
                                value.methodofjoin = 'Customer Representative';
                                value.methodOfOrder = 'Customer Representative';
                            } else {
                                value.methodofjoin = 'Relationship Partner';
                                value.methodOfOrder = 'Relationship Partner';
                            }
                            MyServices.saveOrderCheckoutCart(value.customerName, value.methodofjoin, value.methodOfOrder, value.customerMobile, value.methodOfPayment, function(data) {
                              $.jStorage.set("NewOrder",null);
                                if (data.status == 200) {
                                    $state.go('success');
                                } else {
                                    $state.go('wrong');
                                }
                            });
                        }
                    });
                } else {
                    $ionicPopup.alert({
                        cssClass: 'productspopup',
                        title: '<img src="img/sorry.png">',
                        template: "This customer is already registered with another partner.",
                        buttons: [{
                            text: 'Ok',
                            onTap: function(e) {}
                        }, {
                            text: 'Cancel',
                            onTap: function(e) {}
                        }]
                    });
                }
            });


        };
    })
    .controller('BrowseCtrl', function($scope, $stateParams, $ionicLoading, $ionicSlideBoxDelegate, MyServices, $state, $timeout) {
        $scope.userDetails = MyServices.getAppDetails();
        console.log("dsad",$scope.userDetails);
        MyServices.showCardQuantity(function(num) {
            $scope.totalQuantity = num;
        });
        // $ionicLoading.show({
        //     content: '<img src="img/loading.gif" alt="">',
        //     animation: 'fade-in',
        //     showBackdrop: true,
        //     maxWidth: 200,
        //     showDelay: 0
        // });
        $scope.loader = true;

        $scope.slideHasChanged = function(index) {
            $ionicSlideBoxDelegate.cssClass = 'fade-in'
            $scope.slideIndex = index;
            if (($ionicSlideBoxDelegate.count() - 1) == index) {
                $timeout(function() {
                    $ionicSlideBoxDelegate.slide(0);

                }, $scope.interval);
            }
        };

        $scope.interval = 5000;
        $scope.homeSlider = {};
        $scope.homeSlider.data = [];
        $scope.homeSlider.currentPage = 0;

        $scope.setupSlider = function() {

            //some options to pass to our slider
            $scope.homeSlider.sliderOptions = {
                initialSlide: 0,
                direction: 'horizontal', //or vertical
                speed: 300,

                autoplay: "5000",
                effect: 'fade',

            };


            //create delegate reference to link with slider
            $scope.homeSlider.sliderDelegate = null;

            //watch our sliderDelegate reference, and use it when it becomes available
            $scope.$watch('homeSlider.sliderDelegate', function(newVal, oldVal) {
                if (newVal != null) {
                    $scope.homeSlider.sliderDelegate.on('slideChangeEnd', function() {
                        $scope.homeSlider.currentPage = $scope.homeSlider.sliderDelegate.activeIndex;
                        //use $scope.$apply() to refresh any content external to the slider
                        $scope.$apply();
                    });
                }
            });
        };

        $scope.setupSlider();



        //detect when sliderDelegate has been defined, and attatch some event listeners
        $scope.$watch('sliderDelegate', function(newVal, oldVal) {
            if (newVal != null) {
                $scope.sliderDelegate.on('slideChangeEnd', function() {
                    console.log('updated slide to ' + $scope.sliderDelegate.activeIndex);
                    $scope.$apply();
                });
            }
        });
        $scope.nextPage = function(sub, id) {
            $.jStorage.set("prevId", id);
            if (sub == 'Yes') {
                $state.go('app.browse-more', {
                    'category': id
                });

            } else {
                $state.go('app.productSpecs', {
                    'category': id
                });
            }
        };



        $scope.goBackHandler = function() {
            window.history.back(); //This works
        };
        MyServices.categories(function(data) {
            // $ionicLoading.hide();
           $scope.loader = false;

            console.log(data);
            $scope.category = _.groupBy(data.data, "subscription");
            $scope.subscription = $scope.category["Yes"];
            $scope.notSubscription = $scope.category["No"];
            $scope.notSubscription = _.chunk($scope.notSubscription, 2);
            console.log($scope.notSubscription);

        });
        $scope.profile = $.jStorage.get('profile');
        $scope.getProfield = {};
        console.log($scope.profile);
        $scope.getProfield._id = $scope.profile._id;
        MyServices.getProfile($scope.getProfield, function(data) {
            if (data.value) {
                $scope.browse = data.data;
            } else {

            }
        });
        MyServices.featureprods(function(data) {
            $scope.feaprods = data.data;
            $ionicSlideBoxDelegate.update();
        });
    })
    .controller('ProductSpecsCtrl', function($scope, $state, $stateParams, MyServices, $ionicPopup) {
        $scope.goBackHandler = function() {
            window.history.back();
        };
        $scope.userDetails = MyServices.getAppDetails();
        MyServices.showCardQuantity(function(num) {
            $scope.totalQuantity = num;
        });
        $scope.profile = $.jStorage.get('profile');
        MyServices.products({
            category: $stateParams.category
        }, function(data) {
            $scope.products = data.data;
            _.each($scope.products, function(n) {
                n.productQuantity = 0;
            });
        });
        $scope.checkMinProduct = function(product) {
            if (!product.productQuantity || product.productQuantity <= 0) {
                return true;
            } else {
                return false;
            }
        };
        $scope.checkMaxProduct = function(product) {
            if (product.productQuantity >= parseInt(product.quantity)) {
                return true;
            } else {
                return false;
            }
        };
        $scope.changeProductQuantity = function(product, change) {
            if (_.isNaN(parseInt(product.productQuantity))) {
                product.productQuantity = 0;
            }
            if (change) {
                product.productQuantity++;
            } else {
                product.productQuantity--;
            }
        };
        $scope.addToCart = function() {
            var products = _.map(_.filter($scope.products, function(n) {
                return (n.productQuantity && n.productQuantity >= 1);
            }), function(n) {
                return {
                    productQuantity: n.productQuantity,
                    product: n._id,
                    totalAmount: n.productQuantity * parseFloat(n.price)
                };
            });
            if (products.length > 0) {
                MyServices.addToCart(products, function(data) {
                    if (data.status == 200) {
                        var myPopup = $ionicPopup.show({
                            cssClass: 'successpopup',
                            title: '<img src="img/tick.png">',
                            subTitle: 'Products Added Successfully!',
                            buttons: [{

                                text: 'Buy More',
                                onTap: function(e) {
                                    $state.go("app.browse");
                                }
                            }, {
                                text: 'View Cart',
                                type: 'button-positive',
                                onTap: function(e) {
                                    $state.go("app.review");
                                }
                            }]
                        });
                    } else {
                        $ionicPopup.alert({
                            cssClass: 'productspopup',
                            title: '<img src="img/linkexpire.png">',
                            template: "Error Occured while adding Products to Cart"
                        });
                    }
                });
            } else {
                $ionicPopup.alert({
                    title: "No Product",
                    template: "No Product for Add to Cart"
                });

            }

        };
    })
    .controller('PlaylistsCtrl', function($scope) {
        $scope.playlists = [{
            title: 'Reggae',
            id: 1
        }, {
            title: 'Chill',
            id: 2
        }, {
            title: 'Dubstep',
            id: 3
        }, {
            title: 'Indie',
            id: 4
        }, {
            title: 'Rap',
            id: 5
        }, {
            title: 'Cowbell',
            id: 6
        }];
    })
    .controller('PlaylistCtrl', function($scope, $stateParams) {})
    .controller('HelpCtrl', function($scope) {
        $scope.goBackHandler = function() {
            window.history.back(); //This works
        };
    })
    .controller('ProfileCtrl', function($scope, MyServices, $ionicPopup) {
        $scope.goBackHandler = function() {
            window.history.back(); //This works
        };
        $scope.profile = $.jStorage.get('profile');

        $scope.getProfield = {};
        console.log($scope.profile);
        $scope.getProfield._id = $scope.profile._id;
        MyServices.getProfile($scope.getProfield, function(data) {
            console.log(data);
            if (data.value) {
                $scope.signupForm = data.data;
                console.log($scope.review);
            } else {

            }
        });

        $scope.save = function() {

            MyServices.saveData($scope.signupForm, function(data) {

                console.log(data);
                $scope.signupForm = data.data;

                console.log($scope.signupForm)
                if (data.value == true) {


                    $scope.signupForm._id = $.jStorage.get('profile')._id;
                    MyServices.getonePro($scope.signupForm, function(data) {
                        if (data.value) {
                            $.jStorage.set('profile', data.data);
                            $scope.signupForm = data.data
                            $ionicPopup.alert({
                                title: "Profile",
                                template: "Profile updated successfully"
                            });
                        }
                    });
                } else {
                    // $scope.showAlert(data.status, 'login', 'Error Message');
                }
            });
        }
    })
    .controller('CustomerListCtrl', function($scope, $state, MyServices, $ionicLoading, $ionicPopover) {

        $ionicPopover.fromTemplateUrl('templates/modal/popover.html', {
            scope: $scope,
            cssClass: 'menupop',

        }).then(function(popover) {
            $scope.popover = popover;
        });

        $scope.closePopover = function() {
            $scope.popover.hide();
        };


        $ionicPopover.fromTemplateUrl('templates/modal/dropdown.html', {
            scope: $scope,
            cssClass: 'menupop',

        }).then(function(dropdown) {
            $scope.dropdown = dropdown;
        });



        $scope.closePopover = function() {
            $scope.dropdown.hide();
        };
        $scope.addNewOrder = function(customerId) {
          $.jStorage.set("NewOrder",customerId);
          $state.go('app.browse');
        };
        $scope.profile = $.jStorage.get('profile');
        $scope.getProfield = {};
        console.log($scope.profile);
        $scope.getProfield._id = $scope.profile._id;
        MyServices.getCust($scope.getProfield, function(data) {
            console.log(data);
            if (data.value) {
                $scope.custlist = data.data.customer;
                $scope.custlist = _.groupBy(data.data.customer, "status");
                $scope.pending = $scope.custlist["pending"];
                $scope.existing = $scope.custlist["Existing"];
                console.log($scope.pending);
            }
        });

    })
    .controller('EarningCtrl', function($scope, $stateParams, MyServices, $ionicPopover, $ionicSideMenuDelegate) {

        $ionicSideMenuDelegate.canDragContent(false);

        $ionicPopover.fromTemplateUrl('templates/popover.html', {
            scope: $scope,
            cssClass: 'menupop',

        }).then(function(popover) {
            $scope.popover = popover;
        });
        $scope.closePopover = function() {
            $scope.popover.hide();
        };

        $scope.user = {};
        $scope.user.user = $.jStorage.get('profile')._id;

        MyServices.getAllDeliveryReqByRP($scope.user, function(data) {
            console.log(data);
            if (data.value) {
                $scope.earningsList = data.data;
                console.log($scope.earningsList);
            }
        });

    })
    .controller('VerifyCtrl', function($scope, $stateParams, MyServices, $timeout, $state, $ionicLoading, $ionicPopup) {
        $.jStorage.flush();
        $scope.resend = true;
        $scope.otp = null;

        var reqObj = {};
        var otp = {};
        reqObj.mobile = $stateParams.no;
        reqObj.accessLevel = "Relationship Partner";

        $(".inputs").keyup(function() {
            if (this.value.length == this.maxLength) {
                var $next = $(this).next('.inputs');
                if ($next.length) {
                    $(this).next('.inputs').focus();
                } else {
                    $(this).blur();
                }
            }
        });
        $scope.otpenable = false;

        $scope.disableotp = function(value) {
            console.log(value);
            if (value.first >= 0 && value.second >= 0 && value.third >= 0 && value.forth >= 0) {
                $scope.otpenable = true;
            } else {
                $scope.otpenable = false;
            }
        }

        //Function to verify OTP
        $scope.verifyOTP = function(value) {
            reqObj.otp = "" + value.first + value.second + value.third + value.forth;

            MyServices.verifyOTP(reqObj, function(data) {
                if (data.value) {
                    $scope.profile = $.jStorage.set('profile', data.data);
                    $state.go('signup');
                } else {
                    $scope.otp = null;
                    // alert("OTP verification failed")
                    $ionicPopup.alert({
                        title: "OTP verification failed",
                        template: "Please enter correct otp"
                    });


                }
            });
        };
        $scope.getOTP = function() {
            $scope.resend = false;
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            MyServices.getOTP({
                mobile: $stateParams.no,
                accessLevel: "Relationship Partner"
            }, function(data) {
                if (data.status == 200) {
                    $ionicLoading.hide();
                    $timeout(function() {
                        $scope.resend = true;
                    }, 10000);
                } else {
                    alert("unable to generate OTP. Please try again");
                }
            });



        };
    })
    .controller('ConfirmationCtrl', function($scope, $stateParams, MyServices, $ionicHistory) {
        $ionicHistory.clearHistory();
        $.jStorage.set("cartQuantity", 0);
        var appDetail = MyServices.getAppDetails();
        appDetail.cartQuantity = 0;
        $scope.goBackHandler = function() {
            window.history.back(); //This works
        };
    })
    .controller('LogoutCtrl', function($scope, $stateParams, $state, MyServices) {
        $.jStorage.flush();
        $state.go("login");
    })
    .controller('LoginCtrl', function($scope, $stateParams, $state, MyServices) {
        $scope.loginInfo = {};
        $scope.joinInDisabled = true;
        $scope.loginNumberChange = function(num) {
            num = num + "";
            if (num.length === 10) {
                $scope.joinInDisabled = false;
            } else {
                $scope.joinInDisabled = true;
            }
        };
        $scope.profile = $.jStorage.get('profile');
        if ($scope.profile !== null) {
            if ($scope.profile.verification == 'Not Verified') {
                $state.go('verification');
            } else {
                $state.go('app.dashboard');

            }
        }
        $scope.getOTP = function(value) {
            console.log("value", value);
            value.accessLevel = "Relationship Partner"
            if (value.mobile != null && value.mobile != "") {
                MyServices.getOTP({
                    mobile: value.mobile,
                    accessLevel: value.accessLevel
                }, function(data) {
                    if (data.status == 200) {
                        $state.go('verify', {
                            no: value.mobile
                        });
                    } else {
                        alert("unable to generate OTP. Please try again");
                    }
                });
            } else {
                alert("Please provide mobile number");
            }


        };
    })
    .controller('DashboardCtrl', function($scope,$state, $stateParams, $ionicPopup, MyServices, $ionicHistory, $ionicSlideBoxDelegate) {
        $scope.profile = $.jStorage.get('profile');
        $ionicHistory.clearHistory();
        $scope.NewCust = function() {
          $.jStorage.set("NewOrder",null);
          $state.go('app.browse');
        }

        $scope.showPopup = function() {
            $scope.show = $ionicPopup.show({
                templateUrl: 'templates/modal/price.html',
                cssClass: "priceCard ",
                scope: $scope
            });
        };
        MyServices.getDashboard(function(data) {
            if (data.status == 200) {
                $scope.dashboardData = data.data.data;
            }
        });
        $scope.closePopup = function() {
            $scope.show.close();
        };
        $scope.lockSlide = function() {
            $ionicSlideBoxDelegate.enableSlide(false);
        };
        $scope.myActiveSlide = 1;

        $scope.slidePrevious = function() {

            $ionicSlideBoxDelegate.previous();
        };

        $scope.slideNext = function() {

            $ionicSlideBoxDelegate.next();
        };
        $scope.getProfield = {};
        console.log($scope.profile);
        $scope.getProfield._id = $scope.profile._id;
        MyServices.getProfile($scope.getProfield, function(data) {
            if (data.value) {
                $scope.dash = data.data;
            } else {

            }
        });
    })
    .controller('PincodeCtrl', function($scope, $ionicPopup, $stateParams, $ionicActionSheet, $cordovaFileTransfer, $cordovaCamera, $ionicPopover, $state, MyServices, $cordovaImagePicker) {})
    .controller('SignUpCtrl', function($scope, $ionicPopup, $stateParams, $ionicActionSheet, $cordovaFileTransfer, $cordovaCamera, $ionicPopover, $state, MyServices, $cordovaImagePicker) {
        $scope.signup = {}
        $scope.show = '';
        $ionicPopover.fromTemplateUrl('templates/modal/terms2.html', {
            scope: $scope,
            cssClass: 'menupop',

        }).then(function(terms2) {
            $scope.terms2 = terms2;
        });

        $ionicPopover.fromTemplateUrl('templates/modal/pincode.html', {
            scope: $scope,
            cssClass: 'menupop',

        }).then(function(pincode) {
            $scope.pincode = pincode;
        });
        $scope.closePincode = function() {
            $scope.pincode.hide();
        };
        $scope.closePopover = function() {
            $scope.terms.hide();
        };
        $scope.openpincode = function($event) {
            $scope.pincode.show($event);
        };
        $scope.goBackHandler = function() {
            window.history.back(); //This works
        };

        $scope.signupForm = {};
        $scope.signup = function() {
            $scope.signupForm.accessLevel = "Relationship Partner";
            console.log("djfgjk", $scope.signupForm);

            if (!$.jStorage.get('profile')) {

                MyServices.signup($scope.signupForm, function(data) {

                    console.log(data);
                    $scope.signupForm = data.data;
                    $.jStorage.set('profile', data.data);
                    console.log($scope.signupForm)
                    if (data.value == true) {


                        $scope.signupForm._id = $.jStorage.get('profile')._id;
                        MyServices.getonePro($scope.signupForm, function(data) {
                            $.jStorage.set('profile', data.data);
                            $scope.signupForm = data.data;
                            $scope.user = {};
                            $scope.user.pin = data.data.pincode
                            MyServices.getByPin($scope.user, function(data) {
                                if (data.value) {
                                    $state.go('verification');

                                } else {
                                    console.log("dsjg");
                                    $state.go('pincode');
                                }
                            });
                        });


                    } else {

                        // $scope.showAlert(data.status, 'login', 'Error Message');
                    }
                });
            } else {
                MyServices.saveData($scope.signupForm, function(data) {

                    console.log(data);
                    $scope.signupForm = data.data;

                    console.log($scope.signupForm)
                    if (data.value == true) {


                        $scope.signupForm._id = $.jStorage.get('profile')._id;
                        MyServices.getonePro($scope.signupForm, function(data) {
                            $.jStorage.set('profile', data.data);
                            $scope.signupForm = data.data;
                            $scope.user = {};
                            $scope.user.pin = data.data.pincode
                            MyServices.getByPin($scope.user, function(data) {
                                if (data.value) {
                                    $state.go('verification');

                                } else {
                                    console.log("dsjg");
                                    $state.go('pincode');
                                }
                            });
                        });


                    } else {

                        // $scope.showAlert(data.status, 'login', 'Error Message');
                    }
                });
            }


        }
        $scope.profile = $.jStorage.get('profile');
        if ($scope.profile != null) {
            $scope.signupForm = $scope.profile;
        }
        $scope.showActionsheet = function(card) {
            console.log(card);
            $ionicActionSheet.show({
                //  titleText: 'choose option',
                buttons: [{
                    text: '<i class="icon ion-images"></i> Choose from gallery'
                }, {
                    text: '<i class="icon ion-ios-camera-outline"></i> Take from camera'
                }, ],
                //  destructiveText: 'Delete',
                cancelText: 'Cancel',
                cancel: function() {
                    console.log('CANCELLED');
                },
                buttonClicked: function(index) {
                    console.log('BUTTON CLICKED', index);
                    if (index === 0) {
                        $scope.getImageSaveContact(card);
                    } else {
                        $scope.openCamera(card);
                    }
                    return true;
                },
                destructiveButtonClicked: function() {
                    console.log('DESTRUCT');
                    return true;
                }
            });
        };

        $scope.openCamera = function(card) {
            var cameraOptions = {
                quantityuality: 90,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: false,
                encodingType: 0,
                targetWidth: 1200,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true,
                correctOrientation: true
            };
            $cordovaCamera.getPicture(cameraOptions).then(function(imageData) {
                $scope.imageSrc = "data:image/jpeg;base64," + imageData;
                console.log($scope.imageSrc);
                $scope.uploadImage($scope.imageSrc, card);
            }, function(err) {

                console.log(err);
            });
        };

        $scope.getImageSaveContact = function(card) {
            // Image picker will load images according to these settings
            var options = {
                maximumImagesCount: 1, // Max number of selected images
                width: 800,
                height: 800,
                quantityuality: 80 // Higher is better
            };
            $cordovaImagePicker.getPictures(options).then(function(results) {
                console.log(results);
                $scope.uploadImage(results[0], card);
            }, function(error) {
                console.log('Error: ' + JSON.stringify(error)); // In case of error
            });
        };

        $scope.uploadImage = function(imageURI, card) {
            console.log('imageURI', imageURI);
            // $scope.showLoading('Uploading Image...', 10000);
            $cordovaFileTransfer.upload(adminurl + 'upload', imageURI)
                .then(function(result) {
                    // Success!
                    // $scope.hideLoading();
                    result.response = JSON.parse(result.response);
                    console.log(result.response.data[0]);
                    if (card == 'pan') {
                        $scope.signupForm.panCard = result.response.data[0];
                    } else {
                        $scope.signupForm.adharCard = result.response.data[0];
                    }
                })
        };
    });
