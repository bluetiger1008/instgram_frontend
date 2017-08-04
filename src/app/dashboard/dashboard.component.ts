import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';

import { InstagramService } from '../core/services';

import { TopPost, TopHashTag, FollowersTimeline } from 'app/core/models';

import * as Chartist from 'chartist';

declare var $:any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, AfterViewInit{
    // constructor(private navbarTitleService: NavbarTitleService, private notificationService: NotificationService) { }
    public tableData: TableData;

    username: string;
    topPost: TopPost = new TopPost();
    topHashTags: Array<TopHashTag> = [];
    followersTimeline: Array<FollowersTimeline> = [];
    timelineLabels: string[] = [];
    timelineSeries: number[] = [];

    constructor (
        private instagramService: InstagramService
    ) {}

    startAnimationForLineChart(chart){
      var seq, delays, durations;
      seq = 0;
      delays = 80;
      durations = 500;
      
      chart.on('draw', function(data) {

        if(data.type === 'line' || data.type === 'area') {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint
            }
          });
        } else if(data.type === 'point') {
              seq++;
              data.element.animate({
                opacity: {
                  begin: seq * delays,
                  dur: durations,
                  from: 0,
                  to: 1,
                  easing: 'ease'
                }
              });
          }
      });

      seq = 0;
    }
  

    getInstaName() {
        this.instagramService.getInstaName().subscribe(res => {
            this.username = res.username;
        });
    }

    getTopPost() {
        this.instagramService.getTopPost().subscribe((res: TopPost) => {
            this.topPost = res;
        });
    }

    getTopHashTags() {
        this.instagramService.getTopHashTags().subscribe(res => {
            this.topHashTags = res;
        });
    }

    getFollowersTimeline() {
        this.instagramService.getFollowersTimeline().subscribe(res => {
            this.followersTimeline = res;
            var dateTempArry = [];
            var max_num_followers = 0;

            for( var i = 0; i< this.followersTimeline.length; i++) {
                var IndexOfSpace = this.followersTimeline[i].timestamp.indexOf(" ");
                var dateStr = this.followersTimeline[i].timestamp.slice(0, IndexOfSpace);
                var date = new Date(dateStr);
                dateTempArry.push(date);

                this.timelineSeries.push(this.followersTimeline[i].num_followers);
            }

            max_num_followers = Math.max.apply(null, this.timelineSeries);

            var date_sort_asc = function (date1, date2) {
                  // This is a comparison function that will result in dates being sorted in
                  // ASCENDING order. As you can see, JavaScript's native comparison operators
                  // can be used to compare dates. This was news to me.
                  if (date1 > date2) return 1;
                  if (date1 < date2) return -1;
                  return 0;
            };

            dateTempArry.sort(date_sort_asc);

            for (var i = 0; i < dateTempArry.length; i ++) {
                var timelineLabel = dateTempArry[i].getFullYear() + '-' + dateTempArry[i].getMonth() + '-' + dateTempArry[i].getDay();
                this.timelineLabels.push(timelineLabel);
            }
            this.drawChart(max_num_followers);
        });
    }

    // constructor(private navbarTitleService: NavbarTitleService) { }
    public ngOnInit() {
        this.getInstaName();
        this.getTopPost();
        this.getTopHashTags();
        this.getFollowersTimeline();
    }

    private drawChart(max_num_followers): void {
        var followersTimeline = {
              labels: this.timelineLabels,
              series: [
                  this.timelineSeries
              ]
            };

        var optionsFollwersLineChart = {
          lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
          }),
          low: 0,
          high: (Math.floor(max_num_followers/200) + 1) * 200, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
        }

        var followersLineChart = new Chartist.Line('#followers_chart', followersTimeline, optionsFollwersLineChart);

        this.startAnimationForLineChart(followersLineChart);
    }

    ngAfterViewInit(){
       var breakCards = true;
       if(breakCards == true){
           // We break the cards headers if there is too much stress on them :-)
           $('[data-header-animation="true"]').each(function(){
               var $fix_button = $(this);
               var $card = $(this).parent('.card');
               $card.find('.fix-broken-card').click(function(){
                   console.log(this);
                   var $header = $(this).parent().parent().siblings('.card-header, .card-image');
                   $header.removeClass('hinge').addClass('fadeInDown');

                   $card.attr('data-count',0);

                   setTimeout(function(){
                       $header.removeClass('fadeInDown animate');
                   },480);
               });

               $card.mouseenter(function(){
                   var $this = $(this);
                   var hover_count = parseInt($this.attr('data-count'), 10) + 1 || 0;
                   $this.attr("data-count", hover_count);
                   if (hover_count >= 20){
                       $(this).children('.card-header, .card-image').addClass('hinge animated');
                   }
               });
           });
       }
       //  Activate the tooltips
       $('[rel="tooltip"]').tooltip();
    }
}
