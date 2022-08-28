import datetime


ONE_MINUTE = 60
ONE_HOUR = ONE_MINUTE * 60
ONE_DAY = ONE_HOUR * 24
ONE_WEEK = ONE_DAY * 7
ONE_MONTH = ONE_DAY * 30
ONE_YEAR = ONE_DAY * 365


def timestamp_representation(timestamp):
    time_diff = round(
        (datetime.datetime.now() - timestamp).total_seconds()
    )

    if time_diff < ONE_MINUTE: 
        return 'a moment ago'
    if time_diff <= ONE_HOUR:
        return f'{time_diff // ONE_MINUTE} minute[s] ago'
    if time_diff <= ONE_DAY:
        return f'{time_diff // ONE_HOUR} hour[s] ago'
    if time_diff <= ONE_WEEK:
        return f'{time_diff // ONE_DAY} day[s] ago'
    if time_diff <= ONE_MONTH:
        return f'{time_diff // ONE_WEEK} week[s] ago'
    if time_diff <= ONE_YEAR:
        return timestamp.strftime('%m/%d')
    return timestamp.strftime('%Y/%m/%d')
