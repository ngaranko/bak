from django.contrib import admin


# class ScheduleAdmin(admin.ModelAdmin):
#     search_fields = ['id']
#     list_display = ['__unicode__']
#
#     def get_urls(self):
#         urls = super(ActivityAdmin, self).get_urls()
#
#         my_urls = patterns('',
#             (r'^update-budget-totals', self.admin_site.admin_view(self.update_budget_totals))
#         )
#         return my_urls + urls
#
#     def update_budget_totals(self):
#         update_total = TotalBudgetUpdater()
#         success = update_total.update()
#         if success:
#             return HttpResponse('Success')
#         else:
#             return False
#
# admin.site.register(Activity, ActivityAdmin)
