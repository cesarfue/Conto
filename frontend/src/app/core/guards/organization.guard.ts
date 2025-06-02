import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
