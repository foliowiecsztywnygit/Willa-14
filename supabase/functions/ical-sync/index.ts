import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

// Ten plik służy do synchronizacji iCal z zewnętrznymi portalami (Booking.com, Airbnb itp.)
// Zwraca kalendarz w formacie iCalendar (text/calendar) dla konkretnego pokoju.

serve(async (req) => {
  const url = new URL(req.url)
  const roomId = url.searchParams.get('room_id')

  if (!roomId) {
    return new Response("Missing room_id parameter", { status: 400 })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Pobierz potwierdzone rezerwacje dla danego pokoju
    const { data: bookings, error } = await supabaseClient
      .from('bookings')
      .select('id, check_in, check_out, guest_name')
      .eq('room_id', roomId)
      .in('status', ['confirmed', 'completed'])

    if (error) throw error

    // Generowanie formatu iCal
    const icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Willa Rysy//Booking System//PL',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ]

    for (const b of bookings) {
      // iCal format wymaga dat w formacie YYYYMMDD
      const start = b.check_in.replace(/-/g, '')
      const end = b.check_out.replace(/-/g, '')
      
      icalContent.push(
        'BEGIN:VEVENT',
        `UID:${b.id}@willarysy.pl`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTSTART;VALUE=DATE:${start}`,
        `DTEND;VALUE=DATE:${end}`,
        `SUMMARY:Rezerwacja - ${b.guest_name}`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      )
    }

    icalContent.push('END:VCALENDAR')

    return new Response(icalContent.join('\r\n'), {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="room_${roomId}.ics"`
      }
    })
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})